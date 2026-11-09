import { ApprovedCombination, PathwayName } from '../types';

export interface PathwayMeta {
  id: PathwayName;
  shortName: string;
  tagline: string;
  description: string;
  mathematics: string;
  color: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  tracks: string[];
}

export const PATHWAY_METADATA: Record<PathwayName, PathwayMeta> = {
  STEM: {
    id: 'STEM',
    shortName: 'STEM',
    tagline: 'Sciences, Computing & Engineering',
    description: 'Empowering future doctors, engineers, data scientists, and agricultural innovators through rigorous pure and applied scientific investigation.',
    mathematics: 'Advanced Mathematics',
    color: '#059669', // emerald-600
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    borderColor: 'border-emerald-500/30 dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    tracks: ['ALL TRACKS', 'PURE SCIENCES', 'APPLIED SCIENCES'],
  },
  'SOCIAL SCIENCES': {
    id: 'SOCIAL SCIENCES',
    shortName: 'Social Sciences',
    tagline: 'Humanities, Languages & Commercial Leadership',
    description: 'Preparing articulate leaders, legal scholars, business strategists, economists, diplomats, and communicators with global perspective.',
    mathematics: 'Essential Mathematics',
    color: '#2563eb', // blue-600
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    borderColor: 'border-blue-500/30 dark:border-blue-500/40',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    tracks: ['ALL TRACKS', 'HUMANITIES & BUSINESS STUDIES', 'LANGUAGES & LITERATURE'],
  },
};

// Compulsory for every learner. Mathematics is taken at the level of the chosen pathway.
export const CORE_FOUNDATION_SUBJECTS = [
  { code: 'CORE-1', name: 'Mathematics', category: 'Compulsory' },
  { code: 'CORE-2', name: 'English', category: 'Compulsory' },
  { code: 'CORE-3', name: 'Kiswahili', category: 'Compulsory' },
  { code: 'CORE-4', name: 'Community Service Learning (CSL)', category: 'Compulsory' },
  { code: 'CORE-5', name: 'ICT', category: 'Compulsory' },
  { code: 'CORE-6', name: 'Physical Education (PE)', category: 'Compulsory' },
];

export const APPROVED_COMBINATIONS: ApprovedCombination[] = [
  // =========================================================================
  // STEM Combinations (26 Approved Combinations)
  // =========================================================================
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Computer Studies', 'Geography', 'Physics'],
    code: 'ST2018',
    status: 'Approved',
    recommendedCareers: 'Geomatics, Software Engineering, Telecommunications, Meteorology, Aviation'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Biology', 'Geography'],
    code: 'ST2071',
    status: 'Approved',
    recommendedCareers: 'Agribusiness, Environmental Science, Agricultural Engineering, Forestry, Ecology'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Biology', 'Chemistry', 'Computer Studies'],
    code: 'ST1046',
    status: 'Approved',
    recommendedCareers: 'Bioinformatics, Health Informatics, Pharmaceutical Tech, Biomedical Engineering'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Computer Studies', 'Geography', 'Home Science'],
    code: 'ST2027',
    status: 'Approved',
    recommendedCareers: 'Interior Architecture, Food Systems Tech, Hospitality Tech, Urban Planning'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Business Studies', 'Geography'],
    code: 'ST2050',
    status: 'Approved',
    recommendedCareers: 'Agricultural Economics, Commodity Trading, Farm Enterprise Management, Supply Chain'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Biology', 'Business Studies'],
    code: 'ST2044',
    status: 'Approved',
    recommendedCareers: 'Agro-processing, Biotechnology Enterprises, Veterinary Science, Agribusiness Finance'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Business Studies', 'Computer Studies', 'Geography'],
    code: 'ST2003',
    status: 'Approved',
    recommendedCareers: 'Fintech, Business Analytics, GIS & Spatial Analytics, Logistics, IT Entrepreneurship'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Biology', 'Chemistry', 'Physics'],
    code: 'ST1048',
    status: 'Approved',
    recommendedCareers: 'Medicine & Surgery, Dental Surgery, Chemical Engineering, Biophysics, Pharmacy'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Business Studies', 'Computer Studies'],
    code: 'ST2047',
    status: 'Approved',
    recommendedCareers: 'Agri-Tech Solutions, Smart Farm Management, Agricultural Software, Supply Chain Analytics'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Core Mathematics', 'Business Studies', 'Chemistry'],
    code: 'ST1013',
    status: 'Approved',
    recommendedCareers: 'Industrial Chemistry, Chemical Finance, Actuarial Science, Materials Economics'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Core Mathematics', 'Business Studies', 'Physics'],
    code: 'ST1033',
    status: 'Approved',
    recommendedCareers: 'Financial Engineering, Quantitative Analysis, Computational Physics, Operations Research'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Biology', 'Computer Studies', 'Geography'],
    code: 'ST2011',
    status: 'Approved',
    recommendedCareers: 'Biogeography, Environmental Remote Sensing, Conservation Informatics, GIS'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Business Studies', 'Home Science'],
    code: 'ST2085',
    status: 'Approved',
    recommendedCareers: 'Food Technology Enterprises, Culinary Science Management, Agribusiness, Value Addition'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Core Mathematics', 'Computer Studies', 'Physics'],
    code: 'ST1034',
    status: 'Approved',
    recommendedCareers: 'Computer Engineering, Data Science & Artificial Intelligence, Robotics, Theoretical Physics'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Business Studies', 'Computer Studies', 'Physics'],
    code: 'ST2007',
    status: 'Approved',
    recommendedCareers: 'Instrumentation Tech, Systems Engineering, Tech Entrepreneurship, FinTech Systems'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Business Studies', 'Chemistry'],
    code: 'ST2046',
    status: 'Approved',
    recommendedCareers: 'Agricultural Chemicals, Fertilizer Technology, Agro-Commodities, Soil Science'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Core Mathematics', 'Chemistry', 'Geography'],
    code: 'ST1016',
    status: 'Approved',
    recommendedCareers: 'Geochemistry, Environmental Engineering, Hydrology, Natural Resource Economics'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Chemistry', 'Computer Studies'],
    code: 'ST2059',
    status: 'Approved',
    recommendedCareers: 'Precision Agriculture, Soil Chemistry Analytics, Agri-Data Systems, Agronomy'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Geography', 'Physics'],
    code: 'ST2075',
    status: 'Approved',
    recommendedCareers: 'Agricultural Mechanization, Irrigation Engineering, Hydrometeorology, Climatology'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Computer Studies', 'General Science', 'Geography'],
    code: 'ST2014',
    status: 'Approved',
    recommendedCareers: 'Spatial Data Analytics, Applied Meteorology, Environmental Monitoring, Geospatial Systems'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Core Mathematics', 'Business Studies', 'Computer Studies'],
    code: 'ST2077',
    status: 'Approved',
    recommendedCareers: 'Software Development, Fintech Architecture, Business Analytics, Financial Modeling'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Computer Studies', 'Physics'],
    code: 'ST2067',
    status: 'Approved',
    recommendedCareers: 'Smart Farming Automation, Renewable Agricultural Energy, Agricultural Drone Tech'
  },
  {
    pathway: 'STEM',
    track: 'PURE SCIENCES',
    subjects: ['Agriculture', 'Biology', 'Chemistry'],
    code: 'ST1042',
    status: 'Approved',
    recommendedCareers: 'Veterinary Medicine, Agricultural Biotechnology, Plant Pathology, Food Bio-Engineering'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Biology', 'Business Studies', 'Computer Studies'],
    code: 'ST2097',
    status: 'Approved',
    recommendedCareers: 'Bio-Entrepreneurship, Health Systems Tech, Bioinformatics Management, Medical Software'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Chemistry', 'Computer Studies', 'Home Science'],
    code: 'ST2024',
    status: 'Approved',
    recommendedCareers: 'Food Product Development, Textile Tech, Cosmetic Chemistry, Nutritional Systems'
  },
  {
    pathway: 'STEM',
    track: 'APPLIED SCIENCES',
    subjects: ['Agriculture', 'Business Studies', 'General Science'],
    code: 'ST2049',
    status: 'Approved',
    recommendedCareers: 'Agri-Enterprise Management, Rural Development, Farm Produce Marketing, Extension Services'
  },

  // =========================================================================
  // Social Sciences Combinations (28 Approved Combinations)
  // =========================================================================
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Christian Religious Education', 'History & Citizenship'],
    code: 'SS2008',
    status: 'Approved',
    recommendedCareers: 'Law & Constitutional Affairs, Public Administration, Corporate Governance, Political Science'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Christian Religious Education', 'Literature in English'],
    code: 'SS2009',
    status: 'Approved',
    recommendedCareers: 'Corporate Communications, Legal Studies, Publishing, Ethics & Compliance, Media Law'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Computer Studies', 'History & Citizenship'],
    code: 'SS2095',
    status: 'Approved',
    recommendedCareers: 'Digital Governance, Cyber Law, Business Systems Management, Policy Analytics'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Christian Religious Education', 'Computer Studies'],
    code: 'SS2106',
    status: 'Approved',
    recommendedCareers: 'E-Commerce, Social Entrepreneurship, Non-Profit Leadership, Financial Systems'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'History & Citizenship', 'Literature in English'],
    code: 'SS2082',
    status: 'Approved',
    recommendedCareers: 'Advocacy & Human Rights Law, Diplomacy, Academic Research, Broadcast Journalism, Foreign Affairs'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'French', 'Geography'],
    code: 'SS2068',
    status: 'Approved',
    recommendedCareers: 'International Trade, Global Tourism & Hospitality, Foreign Service, Multilingual Commerce'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['French', 'Geography', 'History & Citizenship'],
    code: 'SS2016',
    status: 'Approved',
    recommendedCareers: 'Diplomacy, United Nations & International NGOs, Tourism Strategy, Geopolitics'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Fasihi ya Kiswahili', 'Geography'],
    code: 'SS2073',
    status: 'Approved',
    recommendedCareers: 'East African Regional Trade, Environmental Journalism, Pan-African Business, Media'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Fasihi ya Kiswahili', 'History & Citizenship'],
    code: 'SS2096',
    status: 'Approved',
    recommendedCareers: 'Public Policy, Regional Diplomacy, Kiswahili Media & Broadcasting, Legal Advocacy'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'French', 'History & Citizenship'],
    code: 'SS2075',
    status: 'Approved',
    recommendedCareers: 'International Relations, Translation & Interpretation, Peace Studies, Cultural Diplomacy'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Geography', 'History & Citizenship'],
    code: 'SS2025',
    status: 'Approved',
    recommendedCareers: 'Economics & Public Policy, Urban Geography, Land Administration, Commercial Law, Banking'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Computer Studies', 'Geography', 'History & Citizenship'],
    code: 'SS2024',
    status: 'Approved',
    recommendedCareers: 'Geographic Information Systems (GIS), Digital Cartography, Public Policy, Urban Governance'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'Geography', 'History & Citizenship'],
    code: 'SS2019',
    status: 'Approved',
    recommendedCareers: 'Environmental Law, Community Development, International Development, Geo-Politics'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Core Mathematics', 'Business Studies', 'Geography'],
    code: 'SS2056',
    status: 'Approved',
    recommendedCareers: 'Urban & Regional Economics, Demographics, Real Estate Analytics, Financial Logistics'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'LANGUAGES & LITERATURE',
    subjects: ['Christian Religious Education', 'Fasihi ya Kiswahili', 'Indigenous Language'],
    code: 'SS1034',
    status: 'Approved',
    recommendedCareers: 'Cultural Heritage Preservation, Indigenous Linguistics, Literary Translation, Community Media'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'General Science', 'History & Citizenship'],
    code: 'SS2098',
    status: 'Approved',
    recommendedCareers: 'Public Sector Management, Science & Tech Policy, Enterprise Development, Civil Service'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'Computer Studies', 'History & Citizenship'],
    code: 'SS2064',
    status: 'Approved',
    recommendedCareers: 'Digital Archiving, Legal Informatics, Ethno-History Research, Non-Profit Tech Leadership'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'Fasihi ya Kiswahili', 'History & Citizenship'],
    code: 'SS2069',
    status: 'Approved',
    recommendedCareers: 'African History & Philosophy, Legal Advocacy, Cultural Diplomacy, Civic Leadership'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'LANGUAGES & LITERATURE',
    subjects: ['Fasihi ya Kiswahili', 'History & Citizenship', 'Indigenous Language'],
    code: 'SS1024',
    status: 'Approved',
    recommendedCareers: 'Linguistics & Lexicography, Broadcast Media, Historical Research, Translation Services'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Christian Religious Education', 'General Science'],
    code: 'SS2115',
    status: 'Approved',
    recommendedCareers: 'Social Entrepreneurship, Healthcare Administration, Environmental Ethics, Community Finance'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Geography', 'Literature in English'],
    code: 'SS2061',
    status: 'Approved',
    recommendedCareers: 'Economic Journalism, Travel & Tourism Marketing, Environmental Communications, Publishing'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'History & Citizenship', 'Literature in English'],
    code: 'SS2100',
    status: 'Approved',
    recommendedCareers: 'Corporate Law, Constitutional Law, Media & Publishing, Public Relations, Diplomacy'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Geography', 'History & Citizenship', 'Literature in English'],
    code: 'SS2004',
    status: 'Approved',
    recommendedCareers: 'Diplomacy & Foreign Affairs, Environmental Journalism, Geo-Political Analysis, Creative Non-Fiction'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'Fasihi ya Kiswahili', 'Geography'],
    code: 'SS2035',
    status: 'Approved',
    recommendedCareers: 'Regional Environmental Planning, Community Development, Faith-based NGO Leadership, Education'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Fasihi ya Kiswahili', 'Geography', 'History & Citizenship'],
    code: 'SS2018',
    status: 'Approved',
    recommendedCareers: 'Regional Geopolitics, East African Integration, Media Broadcasting, Educational Planning'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Business Studies', 'Christian Religious Education', 'French'],
    code: 'SS2112',
    status: 'Approved',
    recommendedCareers: 'Francophone International Trade, Global NGO Administration, Bilingual Corporate Strategy'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'LANGUAGES & LITERATURE',
    subjects: ['Core Mathematics', 'Indigenous Language', 'Literature in English'],
    code: 'SS1069',
    status: 'Approved',
    recommendedCareers: 'Computational Linguistics, Language Technology, Editorial Management, Literary Studies'
  },
  {
    pathway: 'SOCIAL SCIENCES',
    track: 'HUMANITIES & BUSINESS STUDIES',
    subjects: ['Christian Religious Education', 'Geography', 'Literature in English'],
    code: 'SS2047',
    status: 'Approved',
    recommendedCareers: 'Human Rights Advocacy, Environmental Writing, Cultural Anthropology, International Aid'
  },
];
