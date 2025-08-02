// docs/courses/course-data.js
const coursesData = [
    {
        quarter: 'الربع التدريبي الأول',
        code: 'Q1',
        courses: [
            {
                id: 'career_guidance',
                name: 'التوجيه المهني',
                description: 'مقدمة في التوجيه المهني والأخلاقيات العملية',
                objectives: [
                    'فهم أساسيات السلوك المهني',
                    'تطوير مهارات التخطيط الوظيفي'
                ],
                units: [
                    { title: 'الوحدة 1: مقدمة في الأخلاقيات المهنية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: التخطيط الوظيفي', file: 'unit2.pdf' }
                ],
                references: ['كتاب الأخلاقيات المهنية - د. أحمد محمد', 'دليل التخطيط الوظيفي']
            },
            // ... باقي مقررات الربع الأول
        ]
    },
    // ... باقي الأرباع
];

// دالة مساعدة للبحث عن مقرر
function findCourseById(courseId) {
    for (const quarter of coursesData) {
        const course = quarter.courses.find(c => c.id === courseId);
        if (course) {
            return {
                ...course,
                quarterName: quarter.quarter,
                quarterCode: quarter.code
            };
        }
    }
    return null;
}
