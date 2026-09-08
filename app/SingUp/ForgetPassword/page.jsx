import React from 'react'

function page() {
  return (
    <div>
      <form>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: 4 }}>
          Reset Password
        </button>
      </form>
    </div>
  )
}

export default page
