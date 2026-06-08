-- Create predictions table for PakAgri
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommended_crop TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  yield_level TEXT NOT NULL CHECK (yield_level IN ('High', 'Medium', 'Low')),
  estimated_production_kg DECIMAL(10,2) NOT NULL,
  advice TEXT NOT NULL,
  n DECIMAL(10,2) NOT NULL,
  p DECIMAL(10,2) NOT NULL,
  k DECIMAL(10,2) NOT NULL,
  temperature DECIMAL(10,2) NOT NULL,
  humidity DECIMAL(10,2) NOT NULL,
  ph DECIMAL(10,2) NOT NULL,
  rainfall DECIMAL(10,2) NOT NULL,
  area_acres DECIMAL(10,2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policies for users to access their own predictions
CREATE POLICY "Users can view own predictions" ON predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);

-- Add comment
COMMENT ON TABLE predictions IS 'Stores crop predictions for PakAgri users';