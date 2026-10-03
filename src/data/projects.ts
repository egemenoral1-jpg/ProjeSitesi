export interface Project {
  id: string;
  title: string;
  /** Text printed on the cassette label */
  cassetteLabel: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl: string;
  /** Optional: when missing, the LIVE DEMO button is shown disabled. */
  liveUrl?: string;
  /** Optional cassette label colour */
  color?: string;
}

/**
 * Add a project by appending an object here. A cassette is created for it
 * automatically (see data/tapes.ts) and appears on the shelf.
 */
export const projects: Project[] = [
  {
    id: 'movie-success-analyzer',
    title: 'Movie Success Analyzer',
    cassetteLabel: 'MOVIE SUCCESS ANALYZER',
    description:
      'Analyze movie data and discover relationships between ratings, revenue, votes and other attributes. Generates a synthetic dataset, explores it with an OOP analyzer class and plots the insights.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    features: [
      'Data analysis',
      'Visualization',
      'Movie statistics',
      'Top 10 by revenue, IMDb rating, awards and votes',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/Movie-Success-Analyzer',
    color: '#f2b632',
  },
  {
    id: 'film-recommendation-system',
    title: 'Film Recommendation System',
    cassetteLabel: 'FILM RECOMMENDER',
    description:
      'A hybrid movie recommender built on MovieLens 100K. It blends content-based filtering (TF-IDF + cosine similarity) with item-based collaborative filtering.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'TF-IDF'],
    features: [
      'Content-based filtering',
      'Collaborative filtering with mean-centering',
      'Rank-based hybrid merging',
      '100K ratings, 943 users, 1,682 films',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/film-oneri-sistemi',
    color: '#d9534f',
  },
  {
    id: 'ai-cv-matcher',
    title: 'AI CV Matcher',
    cassetteLabel: 'AI CV MATCHER',
    description:
      'AI Job Match Platform: upload a CV, compare it with a job description and get machine-learning driven compatibility insights, skill gaps and recommendations.',
    technologies: ['Python', 'Flask', 'Scikit-learn', 'SQLite', 'Chart.js'],
    features: [
      'CV upload with PDF text extraction',
      'TF-IDF + cosine similarity matching',
      'Skill overlap and missing skills',
      'Dashboard, history and PDF report export',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/proje',
    color: '#4fb3a5',
  },
  {
    id: 'data-analysis-project',
    title: 'Data Analysis Project',
    cassetteLabel: 'HOUSE PRICE ANALYSIS',
    description:
      'End-to-end machine learning on the California Housing dataset: exploratory analysis, cleaning, model comparison and hyper-parameter tuning to predict house prices.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost'],
    features: [
      'EDA: distributions, correlations, outliers',
      'Linear Regression vs Random Forest vs XGBoost',
      'GridSearchCV tuning',
      '20,640 rows, 8 numeric features',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/ev-fiyat-tahmini',
    color: '#8e7cc3',
  },
];
