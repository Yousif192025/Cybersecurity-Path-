/**
 * Self-reported lesson progress (< 100). Not certificate proof.
 */
export async function reportLessonActivity(supabase, lessonId, percentage) {
  if (percentage == null || percentage < 0 || percentage >= 100) {
    throw new Error('percentage must be in [0, 100)');
  }
  const { data, error } = await supabase.rpc('report_lesson_activity', {
    p_lesson_id: lessonId,
    p_self_reported_percentage: percentage,
  });
  if (error) throw error;
  return data;
}

export async function enrollSelfInCourse(supabase, courseId) {
  const { data, error } = await supabase.rpc('enroll_self_in_course', {
    p_course_id: courseId,
  });
  if (error) throw error;
  return data;
}
