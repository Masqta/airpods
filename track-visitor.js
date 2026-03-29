// Netlify Function: Get dashboard statistics
// Returns total orders, revenue, visitors, reviews for admin panel

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
    // Get total orders
    const ordersQuery = 'SELECT COUNT(*) as count FROM orders';
    const ordersResult = await pool.query(ordersQuery);
    const totalOrders = parseInt(ordersResult.rows[0].count);
    
    // Get total revenue
    const revenueQuery = 'SELECT COALESCE(SUM(total_eur), 0) as total FROM orders';
    const revenueResult = await pool.query(revenueQuery);
    const totalRevenue = parseFloat(revenueResult.rows[0].total);
    
    // Get total visitors
    const visitorsQuery = 'SELECT COUNT(*) as count FROM visitors';
    const visitorsResult = await pool.query(visitorsQuery);
    const totalVisitors = parseInt(visitorsResult.rows[0].count);
    
    // Get total reviews
    const reviewsQuery = 'SELECT COUNT(*) as count FROM reviews';
    const reviewsResult = await pool.query(reviewsQuery);
    const totalReviews = parseInt(reviewsResult.rows[0].count);
    
    // Get today's orders
    const todayOrdersQuery = `
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE DATE(created_at) = CURRENT_DATE
    `;
    const todayOrdersResult = await pool.query(todayOrdersQuery);
    const todayOrders = parseInt(todayOrdersResult.rows[0].count);
    
    // Get orders by status
    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `;
    const statusResult = await pool.query(statusQuery);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        stats: {
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          totalVisitors,
          totalReviews,
          todayOrders,
          ordersByStatus: statusResult.rows
        }
      })
    };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
    
  } finally {
    await pool.end();
  }
};
