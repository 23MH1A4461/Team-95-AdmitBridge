import React, { useState } from 'react';
import { Compass, Map, BookOpen, Globe, DollarSign, Briefcase, ChevronRight, FileText, CheckCircle } from 'lucide-react';
import './Explore.css';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('USA');

  const countries = {
    'USA': {
      exams: 'GRE (optional for many), TOEFL/IELTS',
      living: 'Highly dynamic with diverse cultures. Cities can be expensive, but suburban campuses offer lower costs. Great tech and business hubs.',
      currency: 'USD ($)',
      cost: '$15,000 - $25,000 / year',
      workVisa: 'OPT (Optional Practical Training) for 1-3 years post-graduation, followed by H1B lottery.'
    },
    'UK': {
      exams: 'IELTS is preferred. GRE is rarely required.',
      living: 'Rich history and excellent public transport. London is very expensive, but northern cities are much more affordable.',
      currency: 'GBP (£)',
      cost: '£9,000 - £15,000 / year',
      workVisa: '2-year post-study work visa (Graduate Route).'
    },
    'Germany': {
      exams: 'IELTS/TOEFL. German proficiency (A1/A2) is highly recommended for daily life. GRE for specific technical courses.',
      living: 'Excellent standard of living with highly efficient infrastructure. Public universities have negligible tuition fees.',
      currency: 'Euro (€)',
      cost: '€10,000 - €12,000 / year (Blocked account required)',
      workVisa: '18-month job-seeking visa after graduation.'
    },
    'Canada': {
      exams: 'IELTS/TOEFL. GRE is generally not required for Masters programs.',
      living: 'Extremely welcoming and multicultural. Cold winters. High quality of life with free healthcare for permanent residents.',
      currency: 'CAD ($)',
      cost: 'CAD 15,000 - CAD 20,000 / year',
      workVisa: 'Up to 3-year Post-Graduation Work Permit (PGWP).'
    },
    'Australia': {
      exams: 'IELTS/PTE/TOEFL. PTE is very popular for Australian visas.',
      living: 'Great weather, laid-back lifestyle, and vibrant cities. High minimum wage helps with part-time jobs.',
      currency: 'AUD ($)',
      cost: 'AUD 20,000 - AUD 30,000 / year',
      workVisa: '2 to 4 years of post-study work rights depending on the region.'
    }
  };

  return (
    <div className="explore-page fade-in">
      <div className="explore-header">
        <div className="header-icon-wrapper">
          <Compass size={32} color="white" />
        </div>
        <h1>Your Study Abroad Roadmap</h1>
        <p>A complete, step-by-step guide from finishing your B.Tech to landing your dream university abroad.</p>
      </div>

      {/* Section 1: The Timeline */}
      <section className="explore-section">
        <h2 className="section-title"><Map size={24}/> The Post-B.Tech Journey</h2>
        <div className="roadmap-timeline">
          <div className="roadmap-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Profile Evaluation & Research (Month 1-2)</h3>
              <p>Assess your CGPA, projects, and internships. Start researching which countries and courses align with your career goals. Decide if you want a research-focused MS or an industry-focused one.</p>
            </div>
          </div>
          <div className="roadmap-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Standardized Tests (Month 3-5)</h3>
              <p>Prepare for and take your English proficiency test (IELTS, TOEFL, or PTE). If targeting top US universities or specific competitive programs, take the GRE or GMAT.</p>
            </div>
          </div>
          <div className="roadmap-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>University Shortlisting & Documents (Month 6-7)</h3>
              <p>Shortlist 6-10 universities (Safe, Moderate, Ambitious). Draft a compelling Statement of Purpose (SOP), perfect your Resume, and secure 2-3 Letters of Recommendation (LORs) from professors or managers.</p>
            </div>
          </div>
          <div className="roadmap-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Applications & Interviews (Month 8-9)</h3>
              <p>Submit your applications through university portals. Pay application fees and send official test scores. Prepare for technical or behavioral interviews if required by the program.</p>
            </div>
          </div>
          <div className="roadmap-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Admit, Finances & Visa (Month 10-12)</h3>
              <p>Receive admission letters. Finalize your university and pay the enrollment deposit. Show proof of funds, secure an education loan if needed, and apply for your student visa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Exam Guide */}
      <section className="explore-section">
        <h2 className="section-title"><BookOpen size={24}/> Which Exams Do You Need?</h2>
        <div className="exams-grid">
          <div className="exam-card">
            <div className="exam-card-header">
              <h3>English Proficiency</h3>
              <span>Required for almost all countries</span>
            </div>
            <ul>
              <li><CheckCircle size={16}/> <strong>IELTS:</strong> Widely accepted globally (UK, Canada, Aus, Europe). Paper/Computer based.</li>
              <li><CheckCircle size={16}/> <strong>TOEFL:</strong> Heavily preferred in the USA. Primarily computer-based.</li>
              <li><CheckCircle size={16}/> <strong>PTE:</strong> Fastest results, fully computerized. Highly popular for Australia & UK.</li>
              <li><CheckCircle size={16}/> <strong>Duolingo:</strong> Cheaper, taken from home. Accepted by many US/Canada universities recently.</li>
            </ul>
          </div>
          <div className="exam-card">
            <div className="exam-card-header">
              <h3>Academic Aptitude</h3>
              <span>Program & Country Specific</span>
            </div>
            <ul>
              <li><CheckCircle size={16}/> <strong>GRE:</strong> Required for top US STEM/Engineering programs. Tests Math, Verbal, and Writing.</li>
              <li><CheckCircle size={16}/> <strong>GMAT:</strong> The gold standard for MBA and Management Masters globally.</li>
              <li className="tip-box">
                <strong>Pro Tip:</strong> Post-COVID, many US universities have made the GRE optional. Always check the specific university portal!
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Country Comparison */}
      <section className="explore-section">
        <h2 className="section-title"><Globe size={24}/> Country Comparison</h2>
        <div className="country-tabs-container">
          <div className="country-tabs">
            {Object.keys(countries).map(country => (
              <button 
                key={country} 
                className={`country-tab ${activeTab === country ? 'active' : ''}`}
                onClick={() => setActiveTab(country)}
              >
                {country}
              </button>
            ))}
          </div>
          
          <div className="country-content fade-in" key={activeTab}>
            <div className="country-header">
              <h3>Study in {activeTab}</h3>
            </div>
            <div className="country-details-grid">
              <div className="detail-box">
                <div className="detail-icon"><FileText size={20}/></div>
                <div>
                  <h4>Best Exams to Write</h4>
                  <p>{countries[activeTab].exams}</p>
                </div>
              </div>
              <div className="detail-box">
                <div className="detail-icon"><DollarSign size={20}/></div>
                <div>
                  <h4>Currency & Living Costs</h4>
                  <p><strong>{countries[activeTab].currency}</strong></p>
                  <p>{countries[activeTab].cost}</p>
                </div>
              </div>
              <div className="detail-box">
                <div className="detail-icon"><Map size={20}/></div>
                <div>
                  <h4>Living Conditions</h4>
                  <p>{countries[activeTab].living}</p>
                </div>
              </div>
              <div className="detail-box">
                <div className="detail-icon"><Briefcase size={20}/></div>
                <div>
                  <h4>Post-Study Work Visa</h4>
                  <p>{countries[activeTab].workVisa}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final Tips */}
      <section className="explore-section important-tips">
        <h2 className="section-title">Essential Things Every Student Should Know</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Start Early</h4>
            <p>Begin the process at least 12-14 months before your intended intake. Early applicants have higher chances of securing scholarships and admits.</p>
          </div>
          <div className="tip-card">
            <h4>The Power of SOP</h4>
            <p>Your Statement of Purpose is your interview on paper. Do not copy templates. Make it a unique story of why you chose this B.Tech branch and why you want to specialize further.</p>
          </div>
          <div className="tip-card">
            <h4>Block Accounts / Financials</h4>
            <p>Countries like Germany and Canada require you to deposit a year's worth of living expenses in a blocked/GIC account before applying for the visa. Plan your finances accordingly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
