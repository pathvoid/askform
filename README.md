# Askform - Form Creation & Response Collection

> **⚠️ Early Development Notice**  
> This project is currently in early development. Features may be incomplete, APIs may change, and there may be bugs. Use at your own risk and feel free to contribute!

A simple, no-signup form creation platform where anyone can create forms and collect responses via unique links.

## Features

- **Easy Form Creation**: Create forms with text, email, textarea, and number fields
- **Dynamic Fields**: Add/remove fields as needed during form creation
- **Unique URLs**: Each form gets a unique URL for sharing
- **Response Collection**: Collect and view responses in real-time
- **CSV Export**: Download responses as CSV files
- **No Signup Required**: Start creating forms immediately

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: PostgreSQL with pg driver
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database

### 1. Clone and Install

```bash
git clone <repository-url>
cd askform
npm install
```

### 2. Set up PostgreSQL

1. Create a PostgreSQL database
2. Create the following tables:

#### Forms Table
```sql
CREATE TABLE forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Responses Table
```sql
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
POSTGRES_USER=your_username
POSTGRES_HOST=localhost
POSTGRES_DB=askform
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Creating a Form

1. Visit the homepage and click "Create Your First Form"
2. Fill in the form title and description
3. Add form fields by clicking "Add Field"
4. Configure each field:
   - **Type**: text, email, textarea, or number
   - **Label**: The field label shown to users
   - **Required**: Whether the field is mandatory
   - **Placeholder**: Optional placeholder text
5. Click "Create Form" to save

### Sharing Your Form

After creating a form, you'll get a unique URL like:
```
http://localhost:3000/respond/[form-id]
```

Share this URL with anyone to collect responses.

### Viewing Responses

1. From your form page, click "View Responses"
2. See all submitted responses in a table format
3. Download responses as CSV using the "Download CSV" button

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── forms/         # Form and response endpoints
│   ├── create/            # Form creation page
│   ├── form/[id]/         # Form management page
│   ├── respond/[id]/      # Form response page
│   ├── responses/[id]/    # Responses viewing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   └── ui/                # Reusable UI components
├── lib/
│   ├── db.ts              # PostgreSQL database utilities
│   └── utils.ts           # Utility functions
└── schemas/
    └── form.ts            # Zod validation schemas
```

## API Endpoints

- `POST /api/forms` - Create a new form
- `GET /api/forms` - Get all forms
- `GET /api/forms/[id]` - Get a specific form
- `POST /api/forms/[id]/responses` - Submit a form response
- `GET /api/forms/[id]/responses` - Get all responses for a form

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Set up a PostgreSQL database (e.g., Neon, Supabase, or Railway)
5. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.