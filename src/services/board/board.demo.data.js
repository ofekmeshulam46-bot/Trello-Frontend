export const demoBoards = [
	// ==========================================
	// לוח 1: פיתוח מוצר (מלא ועשיר בפיצ'רים)
	// ==========================================
	{
		_id: 'b101',
		title: 'פיתוח אפליקציית AI - גרסה 2.0',
		isStarred: true,
		archivedAt: null,
		createdBy: {
			_id: 'u101',
			fullname: 'נועה לוי',
			imgUrl: 'https://randomuser.me',
		},
		style: {
			backgroundImage: 'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=90")',
		},
		labels: [
			{ id: 'l101', title: 'הושלם', color: '#61bd4f' },
			{ id: 'l102', title: 'בפיתוח', color: '#f2d600' },
			{ id: 'l103', title: 'באג קריטי', color: '#eb5a46' },
			{ id: 'l104', title: 'UI/UX', color: '#c377e0' },
			{ id: 'l105', title: 'Backend', color: '#0079bf' },
		],
		members: [
			{ _id: 'u101', fullname: 'נועה לוי', imgUrl: 'https://randomuser.me' },
			{ _id: 'u102', fullname: 'עומר כהן', imgUrl: 'https://randomuser.me' },
			{ _id: 'u103', fullname: 'מאיה אברהמי', imgUrl: 'https://randomuser.me' },
			{ _id: 'u104', fullname: 'דניאל שפירא', imgUrl: 'https://randomuser.me' },
		],
		groups: [
			{
				id: 'g101',
				title: 'ספרינט נוכחי - בעבודה',
				archivedAt: null,
				style: { backgroundColor: '#fdab3d' },
				tasks: [
					{
						id: 'c101',
						title: 'אינטגרציה למודל שפה (LLM)',
						status: 'inProgress',
						priority: 'critical',
						dueDate: '2026-11-28',
						description: 'חיבור ה-API החדש לצ׳אט, כולל טיפול ב-Streaming וזמני המתנה.',
						comments: [
							{
								id: 'cm101',
								title: '@דניאל אל תשכח להגביל את כמות הטוקנים לבקשה כדי למנוע חריגות.',
								createdAt: 1795000000000,
								byMember: {
									_id: 'u101',
									fullname: 'נועה לוי',
									imgUrl: 'https://randomuser.me',
								},
							},
							{
								id: 'cm102',
								title: 'טופל! הוספתי Rate Limiter בצד השרת.',
								createdAt: 1795010000000,
								byMember: {
									_id: 'u104',
									fullname: 'דניאל שפירא',
									imgUrl: 'https://randomuser.me',
								},
							},
						],
						checklists: [
							{
								id: 'cl101',
								title: 'שלבי פיתוח ובדיקה',
								todos: [
									{ id: 'td101', title: 'הגדרת משתני סביבה ומפתחות', isDone: true },
									{ id: 'td102', title: 'בניית Endpoint ל-Streaming', isDone: true },
									{ id: 'td103', title: 'בדיקות עומסים', isDone: false },
								],
							},
						],
						memberIds: ['u104', 'u102'],
						labelIds: ['l102', 'l105'],
						byMember: {
							_id: 'u101',
							fullname: 'נועה לוי',
							imgUrl: 'https://randomuser.me',
						},
						style: {
							backgroundColor: '#26de81',
						},
					},
					{
						id: 'c102',
						title: 'עיצוב מחדש של דשבורד אנליטיקס',
						status: 'inProgress',
						priority: 'high',
						dueDate: '2026-12-02',
						description: 'יצירת גרפים אינטראקטיביים ותמיכה מלאה במצב כהה (Dark Mode).',
						comments: [],
						checklists: [
							{
								id: 'cl102',
								title: 'רכיבי UI',
								todos: [
									{ id: 'td104', title: 'גרף עמודות שבועי', isDone: true },
									{ id: 'td105', title: 'כרטיסי KPI עליונים', isDone: false },
								],
							},
						],
						memberIds: ['u103'],
						labelIds: ['l104'],
						byMember: {
							_id: 'u103',
							fullname: 'מאיה אברהמי',
							imgUrl: 'https://randomuser.me',
						},
						style: {},
					},
				],
			},
			{
				id: 'g102',
				title: 'תקוע / דורש התערבות',
				archivedAt: null,
				style: { backgroundColor: '#e2445c' },
				tasks: [
					{
						id: 'c103',
						title: 'תיקון קריסה בהעלאת קבצי PDF גדולים',
						status: 'stuck',
						priority: 'critical',
						dueDate: '2026-11-23',
						description: 'מעל 25MB השרת מחזיר שגיאת Timeout. נדרש מעבר להעלאה ישירה ל-S3.',
						comments: [
							{
								id: 'cm103',
								title: 'מחכה לאישור הרשאות AWS מה-DevOps.',
								createdAt: 1795020000000,
								byMember: {
									_id: 'u102',
									fullname: 'עומר כהן',
									imgUrl: 'https://randomuser.me',
								},
							},
						],
						checklists: [],
						memberIds: ['u102', 'u104'],
						labelIds: ['l103', 'l105'],
						byMember: {
							_id: 'u102',
							fullname: 'עומר כהן',
							imgUrl: 'https://randomuser.me',
						},
						style: {
							backgroundColor: '#fc5c65',
						},
					},
				],
			},
			{
				id: 'g103',
				title: 'הושלם ועלה לאוויר',
				archivedAt: null,
				style: { backgroundColor: '#00c875' },
				tasks: [
					{
						id: 'c104',
						title: 'התחברות מהירה עם Google ו-GitHub',
						status: 'done',
						priority: 'medium',
						dueDate: '2026-11-15',
						description: 'הוטמע ונבדק בהצלחה בכל הדפדפנים.',
						comments: [],
						checklists: [],
						memberIds: ['u102'],
						labelIds: ['l101', 'l105'],
						byMember: {
							_id: 'u102',
							fullname: 'עומר כהן',
							imgUrl: 'https://randomuser.me',
						},
						style: {},
					},
					{
						id: 'c105',
						title: 'החלפת לוגו ואייקונים ראשיים',
						status: 'done',
						priority: 'low',
						dueDate: '2026-11-10',
						description: '',
						comments: [],
						checklists: [],
						memberIds: ['u103'],
						labelIds: ['l101', 'l104'],
						byMember: {
							_id: 'u103',
							fullname: 'מאיה אברהמי',
							imgUrl: 'https://randomuser.me',
						},
						style: {},
					},
				],
			},
		],
		activities: [
			{
				id: 'a101',
				title: 'שינה צבע רקע למשימה',
				createdAt: 1795025000000,
				byMember: {
					_id: 'u101',
					fullname: 'נועה לוי',
					imgUrl: 'https://randomuser.me',
				},
				group: {
					id: 'g101',
					title: 'ספרינט נוכחי - בעבודה',
				},
				task: {
					id: 'c101',
					title: 'אינטגרציה למודל שפה (LLM)',
				},
			},
			{
				id: 'a102',
				title: 'העביר משימה לסטטוס תקוע',
				createdAt: 1795020000000,
				byMember: {
					_id: 'u102',
					fullname: 'עומר כהן',
					imgUrl: 'https://randomuser.me',
				},
				group: {
					id: 'g102',
					title: 'תקוע / דורש התערבות',
				},
				task: {
					id: 'c103',
					title: 'תיקון קריסה בהעלאת קבצי PDF גדולים',
				},
			},
		],
		cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
	},

	// ==========================================
	// לוח 2: קמפיין שיווקי - בלאק פריידי (לוח מועדף)
	// ==========================================
	{
		_id: 'b102',
		title: 'קמפיין שיווק ומכירות - סוף שנה',
		isStarred: true,
		archivedAt: null,
		createdBy: {
			_id: 'u103',
			fullname: 'מאיה אברהמי',
			imgUrl: 'https://randomuser.me',
		},
		style: {
			backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=90")',
		},
		labels: [
			{ id: 'l201', title: 'סושיאל', color: '#ff9f1a' },
			{ id: 'l202', title: 'תוכן וקופי', color: '#00c2e0' },
			{ id: 'l203', title: 'מאושר לפרסום', color: '#61bd4f' },
		],
		members: [
			{ _id: 'u101', fullname: 'נועה לוי', imgUrl: 'https://randomuser.me' },
			{ _id: 'u103', fullname: 'מאיה אברהמי', imgUrl: 'https://randomuser.me' },
		],
		groups: [
			{
				id: 'g201',
				title: 'רעיונות וקריאייטיב',
				archivedAt: null,
				style: { backgroundColor: '#a25ddc' },
				tasks: [
					{
						id: 'c201',
						title: 'צילום סרטון Reels להשקת הפיצ׳ר החדש',
						status: 'todo',
						priority: 'high',
						dueDate: '2026-12-05',
						description: 'סרטון קצר של 30 שניות שמדגים איך חוסכים זמן בעזרת האפליקציה.',
						comments: [],
						checklists: [
							{
								id: 'cl201',
								title: 'הכנות לצילום',
								todos: [
									{ id: 'td201', title: 'כתיבת תסריט', isDone: true },
									{ id: 'td202', title: 'שריון ציוד תאורה', isDone: false },
								],
							},
						],
						memberIds: ['u103'],
						labelIds: ['l201', 'l202'],
						byMember: {
							_id: 'u103',
							fullname: 'מאיה אברהמי',
							imgUrl: 'https://randomuser.me',
						},
						style: {
							backgroundColor: '#fed330',
						},
					},
				],
			},
			{
				id: 'g202',
				title: 'מוכן לעלייה לאוויר',
				archivedAt: null,
				style: { backgroundColor: '#00c875' },
				tasks: [
					{
						id: 'c202',
						title: 'ניוזלטר ללקוחות קיימים (40% הנחה)',
						status: 'done',
						priority: 'medium',
						dueDate: '2026-11-25',
						description: 'התבנית עוצבה ונבדקה במובייל ובדסקטופ.',
						comments: [],
						checklists: [],
						memberIds: ['u101', 'u103'],
						labelIds: ['l202', 'l203'],
						byMember: {
							_id: 'u101',
							fullname: 'נועה לוי',
							imgUrl: 'https://randomuser.me',
						},
						style: {},
					},
				],
			},
		],
		activities: [
			{
				id: 'a201',
				title: 'יצרה כרטיס ניוזלטר',
				createdAt: 1794900000000,
				byMember: {
					_id: 'u101',
					fullname: 'נועה לוי',
					imgUrl: 'https://randomuser.me',
				},
				group: {
					id: 'g202',
					title: 'מוכן לעלייה לאוויר',
				},
				task: {
					id: 'c202',
					title: 'ניוזלטר ללקוחות קיימים (40% הנחה)',
				},
			},
		],
		cmpsOrder: ['MemberPicker', 'StatusPicker', 'DatePicker'],
	},

	// ==========================================
	// לוח 3: ניהול משאבי אנוש ורווחה (לוח רגיל)
	// ==========================================
	{
		_id: 'b103',
		title: 'האקתון חברה וגיבוש צוותים',
		isStarred: false,
		archivedAt: null,
		createdBy: {
			_id: 'u102',
			fullname: 'עומר כהן',
			imgUrl: 'https://randomuser.me',
		},
		style: {
			backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=90")',
		},
    }]