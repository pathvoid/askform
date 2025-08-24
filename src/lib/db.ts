import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
}

export interface Form {
  id: string
  title: string
  description: string | null
  fields: FormField[]
  created_at: string
  updated_at: string
}

export interface Response {
  id: string
  form_id: string
  data: Record<string, string | number | boolean>
  created_at: string
}

export const db = {
  // Forms
  async createForm(form: Omit<Form, 'id' | 'created_at' | 'updated_at'>): Promise<Form> {
    const result = await pool.query(
      'INSERT INTO forms (title, description, fields) VALUES ($1, $2, $3) RETURNING *',
      [form.title, form.description, JSON.stringify(form.fields)]
    )
    return result.rows[0]
  },

  async getForm(id: string): Promise<Form | null> {
    const result = await pool.query('SELECT * FROM forms WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getAllForms(): Promise<Form[]> {
    const result = await pool.query('SELECT * FROM forms ORDER BY created_at DESC')
    return result.rows
  },

  // Responses
  async createResponse(response: Omit<Response, 'id' | 'created_at'>): Promise<Response> {
    const result = await pool.query(
      'INSERT INTO responses (form_id, data) VALUES ($1, $2) RETURNING *',
      [response.form_id, JSON.stringify(response.data)]
    )
    return result.rows[0]
  },

  async getResponsesByFormId(formId: string): Promise<Response[]> {
    const result = await pool.query(
      'SELECT * FROM responses WHERE form_id = $1 ORDER BY created_at DESC',
      [formId]
    )
    return result.rows
  },

  async getResponseCount(formId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM responses WHERE form_id = $1',
      [formId]
    )
    return parseInt(result.rows[0].count)
  }
}

export default pool
