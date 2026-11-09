'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => String(CURRENT_YEAR - i));

const initialFormState = {
  year: '',
  brandName: '',
  brandModel: '',
  quantity: '1',
  price: '',
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 ' +
  'focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ' +
  'disabled:bg-gray-100 disabled:text-gray-400';

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      {children}
    </div>
  );
}

// Calls our own Next.js routes (which talk to CarAPI on the server)
async function fetchList(url, key, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  return data[key] || [];
}

export default function SellerUi() {
  const [form, setForm] = useState(initialFormState);

  // Car catalog (loaded from CarAPI)
  const [makes, setMakes] = useState([]);
  const [makesFor, setMakesFor] = useState(null); // year the makes were loaded for
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [models, setModels] = useState([]);
  const [modelsFor, setModelsFor] = useState(null); // "year|brand" the models were loaded for
  const [loadingModels, setLoadingModels] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  // Image upload
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Load brands whenever the year changes
  useEffect(() => {
    if (!form.year) {
      setMakes([]);
      setLoadingMakes(false);
      return;
    }
    const controller = new AbortController();
    setLoadingMakes(true);
    setCatalogError(null);

    fetchList(`/api/cars/makes?year=${form.year}`, 'makes', controller.signal)
      .then((list) => {
        setMakes(list);
        setMakesFor(form.year);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setMakes([]);
        setCatalogError('Could not load the car list. Type the brand and model instead.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingMakes(false);
      });

    return () => controller.abort();
  }, [form.year]);

  // Load models whenever a brand from the list is chosen
  useEffect(() => {
    if (!form.brandName || !makes.includes(form.brandName)) {
      setModels([]);
      setLoadingModels(false);
      return;
    }
    const controller = new AbortController();
    const key = `${form.year}|${form.brandName}`;
    setLoadingModels(true);

    const query = new URLSearchParams({ make: form.brandName, year: form.year });
    fetchList(`/api/cars/models?${query}`, 'models', controller.signal)
      .then((list) => {
        setModels(list);
        setModelsFor(key);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setModels([]);
        setCatalogError('Could not load the car list. Type the brand and model instead.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingModels(false);
      });

    return () => controller.abort();
  }, [form.year, form.brandName, makes]);

  // If CarAPI has nothing for the chosen year/brand (or fails), let the seller type it
  const brandIsText = Boolean(catalogError) || (makesFor === form.year && makes.length === 0);
  const modelIsText =
    Boolean(catalogError) ||
    brandIsText ||
    (modelsFor === `${form.year}|${form.brandName}` && models.length === 0);

  const updateField = (name, value) => {
    setSubmitted(false);
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Changing an earlier choice invalidates the later ones
      if (name === 'year') {
        next.brandName = '';
        next.brandModel = '';
      }
      if (name === 'brandName') next.brandModel = '';
      return next;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError(null);
    setImageUrl(null);
    setSubmitted(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      setImageFile(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setImageFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 5MB.');
      setImageFile(null);
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/add-images/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setImageUrl(data.url);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError('Upload an image before listing the car.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          quantity: Number(form.quantity),
          price: Number(form.price),
          imageUrl,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Could not save listing (${res.status})`);
      }

      setForm(initialFormState);
      setImageUrl(null);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not save listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      <h1 className="text-lg font-semibold">List a car</h1>

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-sm font-medium text-gray-700">
          Photo *
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />

        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected car preview"
            className="rounded border max-h-48 object-contain"
          />
        )}

        {imageFile && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload image'}
          </button>
        )}

        {imageUrl && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-green-600">Image uploaded.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded car"
              className="rounded border max-h-48 object-contain"
            />
          </div>
        )}
      </div>

      {/* Listing details */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="year" label="Year">
          <select
            id="year"
            value={form.year}
            onChange={(e) => updateField('year', e.target.value)}
            className={inputClass}
            required
          >
            <option value="" disabled>Select a year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>

        <Field id="brandName" label="Brand">
          {brandIsText ? (
            <input
              id="brandName"
              type="text"
              placeholder="e.g. Toyota"
              value={form.brandName}
              onChange={(e) => updateField('brandName', e.target.value)}
              className={inputClass}
              required
            />
          ) : (
            <select
              id="brandName"
              value={form.brandName}
              onChange={(e) => updateField('brandName', e.target.value)}
              className={inputClass}
              disabled={!form.year || loadingMakes}
              required
            >
              <option value="" disabled>
                {!form.year
                  ? 'Choose a year first'
                  : loadingMakes
                    ? 'Loading brands...'
                    : 'Select a brand'}
              </option>
              {makes.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          )}
        </Field>

        <Field id="brandModel" label="Model">
          {modelIsText ? (
            <input
              id="brandModel"
              type="text"
              placeholder="e.g. Camry"
              value={form.brandModel}
              onChange={(e) => updateField('brandModel', e.target.value)}
              className={inputClass}
              disabled={!form.brandName}
              required
            />
          ) : (
            <select
              id="brandModel"
              value={form.brandModel}
              onChange={(e) => updateField('brandModel', e.target.value)}
              className={inputClass}
              disabled={!form.brandName || loadingModels}
              required
            >
              <option value="" disabled>
                {!form.brandName
                  ? 'Choose a brand first'
                  : loadingModels
                    ? 'Loading models...'
                    : 'Select a model'}
              </option>
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          )}
        </Field>

        {catalogError && (
          <p className="text-sm text-amber-700" role="status">
            {catalogError}
          </p>
        )}

        <Field id="quantity" label="Quantity">
          <input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={form.quantity}
            onChange={(e) => updateField('quantity', e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <Field id="price" label="Price (₦)">
          <input
            id="price"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 8,500,000"
            value={form.price ? Number(form.price).toLocaleString('en-NG') : ''}
            onChange={(e) => updateField('price', e.target.value.replace(/\D/g, ''))}
            className={inputClass}
            required
          />
        </Field>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {submitted && (
          <p className="text-sm text-green-600" role="status">
            Listing saved.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'List car'}
        </button>
      </form>
    </div>
  );
}