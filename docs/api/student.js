import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const studentId = req.query.id || 1; // افتراضياً نجيب الطالب 1
    try {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('student_id', studentId);

      if (coursesError) throw coursesError;

      return res.status(200).json({ student, courses });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
