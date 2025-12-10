# EasyTax - Simplify Your Tax Compliance

EasyTax is a comprehensive taxtech platform designed to make tax compliance simple, inclusive, and accessible to every Nigerian. It allows users to learn about taxes, calculate what they owe, and pay directly to official tax agencies — all in one place.

## Features

- **Tax Education Portal**: Learn about Nigerian taxes in simple English and Pidgin with visuals and audio guides
- **Interactive Tax Calculator**: Calculate federal and state taxes using official Nigerian tax brackets
- **Secure Payment Integration**: Pay directly to government accounts with Paystack and Flutterwave
- **User Dashboard**: Track payment history, tax calculations, and upcoming deadlines
- **Multilingual Support**: Full English and Pidgin language support with accessibility features
- **Admin Dashboard**: Manage content, analytics, and platform administration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack, Flutterwave
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Paystack/Flutterwave account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd easy-tax
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Payment Gateway Configuration
PAYSTACK_SECRET_KEY=your-paystack-secret-key-here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key-here
FLUTTERWAVE_SECRET_KEY=your-flutterwave-secret-key-here
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-public-key-here

# OpenAI Configuration (Phase 2)
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Set up the database:
Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor.

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription information
- **tax_calculations**: User tax calculation history
- **payments**: Payment transaction records
- **educational_content**: Tax education materials
- **admin**: Admin user management

## Key Features Implementation

### Tax Calculator
- Supports Personal Income Tax (PIT) calculations
- Uses official Nigerian tax brackets (2024)
- Calculates federal and state taxes
- Includes personal allowances and consolidated relief

### Payment Integration
- ₦600 fixed commission per transaction
- Paystack and Flutterwave integration
- Secure payment processing
- Automatic receipt generation

### Multilingual Support
- English and Pidgin language support
- Audio accessibility features
- Text-to-speech capabilities
- Visual and audio learning materials

## Deployment

The application is designed to be deployed on Vercel with the following environment variables configured in the Vercel dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the EasyTax team.