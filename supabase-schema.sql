-- EasyTax Database Schema
-- Based on PRD specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    bvn VARCHAR(20),
    cac_number VARCHAR(20),
    subscription_status BOOLEAN DEFAULT false,
    subscription_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tax calculations table
CREATE TABLE tax_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    income NUMERIC,
    business_type VARCHAR(255),
    occupation VARCHAR(255),
    federal_tax NUMERIC,
    state_tax NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount NUMERIC NOT NULL,
    commission NUMERIC DEFAULT 600,
    government_account VARCHAR(255),
    payment_reference VARCHAR(255),
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Educational content table
CREATE TABLE educational_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    language VARCHAR(50),
    content_type VARCHAR(50),
    content_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin table
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own tax calculations" ON tax_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tax calculations" ON tax_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample educational content
INSERT INTO educational_content (title, language, content_type, content_url) VALUES
('What is Personal Income Tax?', 'english', 'article', '/content/pit-english.md'),
('Wetin be Personal Income Tax?', 'pidgin', 'article', '/content/pit-pidgin.md'),
('Understanding PAYE', 'english', 'video', '/content/paye-english.mp4'),
('Understanding PAYE', 'pidgin', 'video', '/content/paye-pidgin.mp4'),
('Company Income Tax Explained', 'english', 'infographic', '/content/cit-english.png'),
('Company Income Tax Explained', 'pidgin', 'infographic', '/content/cit-pidgin.png');
