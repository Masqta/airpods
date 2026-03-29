// Netlify Function: Save order to Neon PostgreSQL database
// This function receives order data and saves it permanently

const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // CORS headers - allow requests from any origin
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  // Create database connection pool
  // DATABASE_URL comes from Netlify Environment Variables (set in dashboard)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Parse the incoming order data
    const data = JSON.parse(event.body);
    
    console.log('Received order:', data); // Log for debugging
    
    // SQL query to insert order into database
    // Using parameterized queries ($1, $2, etc.) to prevent SQL injection
    const query = `
      INSERT INTO orders (
        name, 
        phone, 
        city, 
        courier, 
        delivery_type, 
        address, 
        qty, 
        total_eur, 
        total_bgn,
        promo_code,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;
    
    // Values to insert (must match the order in the query)
    const values = [
      data.name || '',
      data.phone || '',
      data.city || '',
      data.courier || '',
      data.deliveryType || '',
      data.address || '',
      parseInt(data.qty) || 1,
      parseFloat(data.totalEur) || 0,
      parseInt(data.totalBgn) || 0,
      data.promoCode || '',
      'new' // default status
    ];

    // Execute the query
    const result = await pool.query(query, values);
    
    console.log('Order saved:', result.rows[0]); // Log success
    
    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        order: result.rows[0],
        message: 'Order saved successfully'
      })
    };
    
  } catch (error) {
    console.error('Error saving order:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to save order'
      })
    };
    
  } finally {
    // Always close the database connection
    await pool.end();
  }
};
