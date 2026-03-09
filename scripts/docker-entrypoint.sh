#!/bin/sh

echo "🚀 Starting Acquisitions App Container..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until nc -z neon-local 5432; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "📦 Database is ready!"

# Run database migrations
echo "📜 Running database migrations..."
npm run db:migrate

if [ $? -ne 0 ]; then
    echo "❌ Error: Database migrations failed!"
    exit 1
fi

echo "✅ Database migrations completed successfully!"

# Start the application
echo "🌟 Starting application..."
exec npm run dev