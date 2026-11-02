'use client';

import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Models depend on the selected brand. Add more as needed.
const CARS = {
  Toyota: ['Camry', 'Corolla', 'Avalon'],
  Lexus: ['ES 350', 'RX 350', 'IS 250'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE'],
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

const initialFormState = {
  brandName: '',
  brandModel: '',
  year: '',
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

export default function SellerUi() {
  const [form, setForm] = useState(initialFormState);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (name, value) => {
    setSubmitted(false);
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Changing the brand invalidates the chosen model
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
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
      // Real listings endpoint
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

  const models = CARS[form.brandName] || [];

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
        <Field id="brandName" label="Brand">
          <select
            id="brandName"
            value={form.brandName}
            onChange={(e) => updateField('brandName', e.target.value)}
            className={inputClass}
            required
          >
            <option value="" disabled>Select a brand</option>
            {Object.keys(CARS).map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </Field>

        <Field id="brandModel" label="Model">
          <select
            id="brandModel"
            value={form.brandModel}
            onChange={(e) => updateField('brandModel', e.target.value)}
            className={inputClass}
            disabled={!form.brandName}
            required
          >
            <option value="" disabled>
              {form.brandName ? 'Select a model' : 'Choose a brand first'}
            </option>
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </Field>

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
