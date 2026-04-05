export const BASE_URL = "http://localhost:8080";

const MEDIA_BASE_URL = String(import.meta.env.VITE_MEDIA_BASE_URL || "")
	.trim()
	.replace(/\/$/, "");

const ABSOLUTE_URL_PREFIXES = ["http://", "https://", "//"];

function mediaUrl(path) {
	const value = String(path || "").trim();
	if (!value) {
		return "";
	}

	if (ABSOLUTE_URL_PREFIXES.some((prefix) => value.startsWith(prefix))) {
		return value;
	}

	if (!MEDIA_BASE_URL) {
		return "";
	}

	return `${MEDIA_BASE_URL}/${value.replace(/^\/+/, "")}`;
}

export const STORE_CONFIG = {
	brandName: "DriPort",
	tagline: "Streetwear Drops. Everyday Confidence.",
	supportEmail: "support@driport.com",
	freeShippingThreshold: 899,
	landingCards: [
		{
			id: "new-stock",
			heading: "Trending & New Stock",
			subheading: "Fresh arrivals every week",
			slides: [
				{
						image: mediaUrl("HomePageImages/FirstC/driport-product-FirstC-001.webp"),
					to: "/shop?sort=newest",
				},
				{
						image: mediaUrl("HomePageImages/FirstC/driport-product-FirstC-002.webp"),
					to: "/shop?categories=Jackets",
				},
				{
						image: mediaUrl("HomePageImages/FirstC/driport-product-FirstC-003.webp"),
					to: "/shop?categories=Jeans",
				},
				{
						image: mediaUrl("HomePageImages/FirstC/driport-product-FirstC-004.webp"),
					to: "/shop?categories=Shirts",
				},
				{
						image: mediaUrl("HomePageImages/FirstC/driport-product-FirstC-005.webp"),
					to: "/shop?categories=Tshirts",
				},
			],
		},
		{
			id: "drip-action",
			heading: "Drip In Action",
			subheading: "Models styling current drops",
			slides: [
				{
						image: mediaUrl("HomePageImages/SecondC/driport-product-SecondC-001.webp"),
					to: "/shop?categories=Tshirts",
				},
				{
						image: mediaUrl("HomePageImages/SecondC/driport-product-SecondC-002.webp"),
					to: "/shop?categories=Shirts",
				},
				{
						image: mediaUrl("HomePageImages/SecondC/driport-product-SecondC-003.webp"),
					to: "/shop?categories=Cargos,Trackpants",
				},
				{
						image: mediaUrl("HomePageImages/SecondC/driport-product-SecondC-004.webp"),
					to: "/shop?categories=Shirts",
				},
				{
						image: mediaUrl("HomePageImages/SecondC/driport-product-SecondC-005.webp"),
					to: "/shop?categories=Jackets",
				},
			],
		},
		{
			id: "reviews",
			heading: "Customer Review Screens",
			subheading: "Real shoppers, real feedback",
			slides: [
				{
						image: mediaUrl("HomePageImages/ThirdC/driport-product-ThirdC-001.webp"),
					to: "/profile",
				},
				{
						image: mediaUrl("HomePageImages/ThirdC/driport-product-ThirdC-002.webp"),
					to: "/profile",
				},
				{
						image: mediaUrl("HomePageImages/ThirdC/driport-product-ThirdC-003.webp"),
					to: "/profile",
				},
				{
						image: mediaUrl("HomePageImages/ThirdC/driport-product-ThirdC-004.webp"),
					to: "/profile",
				},
				{
						image: mediaUrl("HomePageImages/ThirdC/driport-product-ThirdC-005.webp"),
					to: "/profile",
				},
			],
		},
	],
	categoryCards: [
		{
			id: "cat-jackets",
			label: "Jackets",
			to: "/shop?categories=Jackets",
			image:
				"https://ehoknazwkonpysnmbqya.supabase.co/storage/v1/object/public/driport-media/ShopProductImages/driport-product-009.webp",
		},
		{
			id: "cat-tshirts",
			label: "Tshirts",
			to: "/shop?categories=Tshirts",
			image:
				"https://ehoknazwkonpysnmbqya.supabase.co/storage/v1/object/public/driport-media/ShopProductImages/driport-product-033.webp",
		},
		{
			id: "cat-shirts",
			label: "Shirts",
			to: "/shop?categories=Shirts",
			image:
				"https://ehoknazwkonpysnmbqya.supabase.co/storage/v1/object/public/driport-media/ShopProductImages/driport-product-098.webp",
		},
		{
			id: "cat-jeans",
			label: "Jeans",
			to: "/shop?categories=Jeans",
			image:
				"https://ehoknazwkonpysnmbqya.supabase.co/storage/v1/object/public/driport-media/ShopProductImages/driport-product-003.webp",
		},
		{
			id: "cat-cargo-track",
			label: "Cargos & Trackpants",
			to: "/shop?categories=Cargos,Trackpants",
			image:
				"https://ehoknazwkonpysnmbqya.supabase.co/storage/v1/object/public/driport-media/ShopProductImages/driport-product-014.webp",
		},
	],
	instagram: {
		profileUrl: "https://www.instagram.com/drip0rt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
		reels: [
			{
				id: "drop-01",
				title: "New Drop: Street Jackets",
				caption: "Fresh arrivals and reel highlight from this week.",
				url: "https://www.instagram.com/reel/CxExample01/",
				thumbnail:
					"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80",
			},
			{
				id: "drop-02",
				title: "Store Walkthrough",
				caption: "Behind the scenes from the DriPort store floor.",
				url: "https://www.instagram.com/reel/CxExample02/",
				thumbnail:
					"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1080&q=80",
			},
			{
				id: "drop-03",
				title: "What's New This Weekend",
				caption: "Top picks from the latest sponsor-curated collection.",
				url: "https://www.instagram.com/reel/CxExample03/",
				thumbnail:
					"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1080&q=80",
			},
		],
	},
	styleCards: [
		{
			id: "style-1",
			brand: "VERO MODA",
			offer: "STARTING ₹1499",
			url: "/shop?brand=vero-moda",
			image:
				"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "style-2",
			brand: "ONLY",
			offer: "STARTING ₹999",
			url: "/shop?brand=only",
			image:
				"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "style-3",
			brand: "KRUS JEANS",
			offer: "STARTING ₹699",
			url: "/shop?category=jeans",
			image:
				"https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "style-4",
			brand: "FOREVER NEW",
			offer: "UP TO 40% OFF",
			url: "/shop?category=dresses",
			image:
				"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "style-5",
			brand: "ALLEN SOLLY",
			offer: "UP TO 30% OFF",
			url: "/shop?category=shirts",
			image:
				"https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
		},
	],
};

export const ABOUT_PAGE_CONTENT = {
	hero: {
		title: "Our Journey",
		subtitle:
			"Building streetwear culture with fresh drops, strong quality, and everyday confidence.",
	},
	story: {
		title: "Built for Streetwear Lovers",
		image:
			"https://images.unsplash.com/photo-1666861585341-5bd1e7b1ed71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3RvcmUlMjBjbG90aGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
		paragraphs: [
			"DriPort started with one clear idea: streetwear should feel premium, expressive, and easy to wear every day. From the beginning, we focused on curating practical yet standout pieces for people who live in motion.",
			"Our team works closely on fit, fabric, and finish so every drop looks sharp and lasts longer. We combine trend direction with comfort-first design to deliver pieces you will actually repeat all week.",
			"Today, DriPort serves a growing community across India, and our promise remains the same: reliable quality, honest pricing, and fresh collections that help you show up with confidence.",
		],
	},
	values: [
		{
			icon: "heart",
			title: "Quality First",
			description:
				"Every item is selected for dependable quality, clean construction, and long-term wear.",
		},
		{
			icon: "globe",
			title: "Community",
			description:
				"We listen to our customers and build collections around real feedback and real use.",
		},
		{
			icon: "award",
			title: "Craftsmanship",
			description:
				"Thoughtful fabric choices and strong finishing details are core to every product.",
		},
		{
			icon: "users",
			title: "Style with Confidence",
			description:
				"We design everyday fits that help you feel confident in college, work, and weekends.",
		},
	],
	team: [
		{
			name: "Sarah Mitchell",
			role: "Founder & Curator",
			image:
				"https://images.unsplash.com/photo-1764627511567-af015c644c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGZhc2hpb24lMjBtb2RlbCUyMHN0eWxlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
		},
		{
			name: "Emma Rodriguez",
			role: "Head Buyer",
			image:
				"https://images.unsplash.com/photo-1764684808666-ca5969aba565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcwNjQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
		},
		{
			name: "James Chen",
			role: "Restoration Specialist",
			image:
				"https://images.unsplash.com/photo-1763922756509-a00702811d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGphY2tldCUyMGxlYXRoZXIlMjB2aW50YWdlfGVufDF8fHx8MTc3MDY0OTcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
		},
	],
	newsletter: {
		title: "Join the DriPort Community",
		subtitle:
			"Subscribe for early access to new drops, styling ideas, and member-only offers.",
		placeholder: "Your email address",
		buttonText: "Subscribe",
	},
};

export const CONTACT_PAGE_CONTENT = {
	hero: {
		title: "Get in Touch",
		subtitle:
			"We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
	},
	contactCards: [
		{
			icon: "mail",
			title: "Email Us",
			lines: ["hello@driport.com", "support@driport.com"],
		},
		{
			icon: "phone",
			title: "Call Us",
			lines: ["+1 (555) 123-4567", "Mon-Fri, 9am-6pm EST"],
		},
		{
			icon: "mapPin",
			title: "Visit Us",
			lines: ["DriPort Studio", "Bengaluru, Karnataka"],
		},
		{
			icon: "clock",
			title: "Store Hours",
			lines: [
				"Monday - Friday: 10am - 7pm",
				"Saturday: 11am - 6pm",
				"Sunday: 12pm - 5pm",
			],
		},
	],
	faq: [
		{
			question: "How do I know if an item will fit?",
			answer:
				"We provide size charts and fit notes on each product page. Compare with a similar item you already own for best accuracy.",
		},
		{
			question: "What is your return policy?",
			answer:
				"We offer a 7-day return and exchange window for eligible products. Items must be unused and in original condition with tags.",
		},
		{
			question: "Are your products original DriPort designs?",
			answer:
				"Yes. Our collection is curated and quality-checked by the DriPort team with a focus on fit, finish, and durability.",
		},
		{
			question: "How long does shipping take?",
			answer:
				"Most orders are delivered within 3-7 business days across India. Delivery timelines may vary by location.",
		},
	],
};