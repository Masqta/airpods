// Netlify Function: Get all orders from Neon PostgreSQL database
// This function retrieves orders for the admin panel

const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept GET requests
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get status filter from query parameters (optional)
    const status = event.queryStringParameters?.status;
    
    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    let values = [];
    
    // If status filter provided, filter orders
    if (status && status !== 'all') {
      query = 'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC';
      values = [status];
    }
    
    const result = await pool.query(query, values);
    
    console.log(`Retrieved ${result.rows.length} orders`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        orders: result.rows,
        count: result.rows.length
      })
    };
    
  } catch (error) {
    console.error('Error getting orders:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        message: 'Failed to retrieve orders'
      })
    };
    
  } finally {
    await pool.end();
  }
};
