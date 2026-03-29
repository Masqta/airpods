// Netlify Function: Get all reviews from database
// Retrieves reviews for display on the site and admin panel

const { Pool } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

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
    // Get limit from query params (optional)
    const limit = parseInt(event.queryStringParameters?.limit) || 100;
    
    const query = `
      SELECT * FROM reviews 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    
    // Calculate average rating
    const avgQuery = 'SELECT AVG(rating) as average FROM reviews';
    const avgResult = await pool.query(avgQuery);
    const averageRating = avgResult.rows[0].average || 0;
    
    // Get rating distribution
    const distQuery = `
      SELECT rating, COUNT(*) as count 
      FROM reviews 
      GROUP BY rating 
      ORDER BY rating DESC
    `;
    const distResult = await pool.query(distQuery);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        reviews: result.rows,
        count: result.rows.length,
        averageRating: parseFloat(averageRating).toFixed(1),
        distribution: distResult.rows
      })
    };
    
  } catch (error) {
    console.error('Error getting reviews:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
    
  } finally {
    await pool.end();
  }
};
