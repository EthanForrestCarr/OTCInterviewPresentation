## Otter Tail County Housing Affordability Project

This project is a portfolio piece designed to showcase data analysis and data visualization skills in the context of a **realistic county government problem**. The focus is on **housing affordability in Otter Tail County (Fergus Falls)** compared with **Minneapolis and the broader metro area**.

The project is inspired by preparing for a **Data Analyst interview with Otter Tail County** and aims to mimic the kind of work a county analyst might do with public data.

---

## Project Scope

Properly scoping this project provides a roadmap and keeps the work tied to a clear analytical story. The scope may evolve as data constraints and discoveries emerge, but this section defines the initial intent.

### 1. Project Goals

- **Primary analytical goal**  
	Quantify and compare **housing affordability** in Fergus Falls / Otter Tail County versus Minneapolis (and potentially Hennepin County) over time.

- **Supporting questions**  
	- How have **median home values**, **median gross rents**, and **household incomes** changed over the last 10–15 years in each geography?  
	- How do **price-to-income** and **rent-to-income** ratios differ between rural Otter Tail County and urban Minneapolis?  
	- What share of households is likely to be **cost-burdened** (spending a high share of income on housing), and how does that compare rural vs metro?  
	- How might these affordability patterns influence **policy, planning, or economic development** decisions for Otter Tail County?

- **Portfolio and interview goal**  
	Produce a clear, web-based visualization and an accompanying analysis that demonstrate:
	- Ability to **source and clean real government data** relevant to a county government.  
	- Ability to **define and compute meaningful metrics** for housing affordability.  
	- Ability to **communicate findings visually** in a way that a non-technical stakeholder (e.g., a county commissioner) can understand.

### 2. Data to Be Used

The project will primarily rely on **public government datasets** that are realistic for county-level analysis:

- **U.S. Census Bureau – American Community Survey (ACS)**  
	- Median home value (owner-occupied units).  
	- Median gross rent.  
	- Median household income.  
	- Cost-burden–related tables where feasible (e.g., gross rent as a share of income).  
	- Geography examples: Fergus Falls city, Otter Tail County, Minneapolis city, Hennepin County.

- **U.S. Department of Housing and Urban Development (HUD)**  
	- Fair Market Rents (FMR) or Small Area FMRs as an additional view on rent levels.

- **Optional local or state data (stretch goals)**  
	- County-level parcel or assessment data (Otter Tail, Hennepin) for trends in assessed value.  
	- Minnesota state or local open data (e.g., building permits, housing stock) if time allows.

The exact tables and years may be adjusted based on data availability and quality, but the emphasis stays on **comparable affordability metrics across rural and metro geographies**.

### 3. Planned Analytical Steps

At a high level, the analysis will follow this path:

1. **Gather and ingest data**  
	 - Download ACS and HUD datasets (CSV or via API).  
	 - Store raw files under a dedicated `backend/data/raw/` directory.

2. **Clean and standardize**  
	 - Filter data to the chosen geographies and years.  
	 - Standardize column names and data types.  
	 - Handle missing or unreliable estimates (e.g., margins of error, null values).

3. **Engineer affordability metrics**  
	 - Compute median home value and median gross rent time series.  
	 - Compute price-to-income and rent-to-income ratios:  
		 - Price-to-income = median home value / median household income.  
		 - Rent-to-income = (median gross rent × 12) / median household income.  
	 - Optionally approximate cost-burdened shares using ACS tables where available.

4. **Prepare data for visualization**  
	 - Aggregate results into tidy, long-format tables suitable for plotting.  
	 - Export processed data as **JSON files** with a clear schema under `backend/data/processed/`.  
	 - Make these JSON files available to the frontend (e.g., by copying them into `frontend/public/data/`).

5. **Visualize and interpret**  
	 - Build interactive charts (via Vite + React + TypeScript) to compare Fergus Falls / Otter Tail vs Minneapolis over time.  
	 - Highlight key differences in affordability and trends.  
	 - Summarize findings and possible implications for Otter Tail County decision-makers.

### 4. Flexibility of Scope

This scope is intended as a **roadmap**, not a rigid contract. As the project progresses:

- Some data sources or tables may prove too noisy, inconsistent, or hard to integrate.  
- New questions may emerge from exploratory analysis (e.g., age structure, migration, or housing types).  
- The visualization layer may suggest different aggregations or metrics.

Adjustments to the scope are expected; the key is to remain focused on the core narrative:  
**"How does housing affordability in Otter Tail County compare to Minneapolis, and what might that mean for county-level decisions?"**

---

## Technical Stack & Architecture

This project is intentionally split into two main parts: a **Python-based data layer** for analysis and a **Vite + React + TypeScript frontend** for web-based visualization. The two layers communicate through **static JSON files**, which keeps deployment simple while still reflecting a realistic data workflow.

### High-Level Architecture

- **Backend (data analysis)**  
	- Pure Python scripts used locally to ingest, clean, and transform public housing-related datasets (ACS, HUD, etc.).  
	- Outputs processed, analysis-ready data as JSON files with a well-defined schema.  
	- No long-running backend service is required for deployment; the backend is used as a data preparation step.

- **Frontend (visualization)**  
	- A Vite-generated **React + TypeScript** single-page application.  
	- Fetches the precomputed JSON files and renders interactive charts and summary views.  
	- Deployed as a static site (e.g., on Render), serving both the compiled frontend and the JSON data.

This architecture mirrors a realistic workflow where analysts prepare data offline and then publish it to a web dashboard for stakeholders.

### Backend: Python Data Layer

- **Language & Libraries**  
	- Python 3.x.  
	- Core libraries: `pandas`, `numpy`, `requests` (for scripted downloads), and optionally `python-dotenv` (for API keys).  

- **Planned structure**  
	- `backend/src/` – Python modules for configuration and data processing (e.g., `process_affordability.py`).  
	- `backend/data/raw/` – raw CSVs or other source files as downloaded from ACS, HUD, or local portals.  
	- `backend/data/processed/` – cleaned and aggregated outputs, including the JSON files consumed by the frontend.  
	- `backend/requirements.txt` – Python dependencies.

- **Responsibility**  
	- Download or load relevant datasets.  
	- Filter to target geographies (Fergus Falls, Otter Tail County, Minneapolis, Hennepin County).  
	- Compute affordability metrics (price-to-income, rent-to-income, trends).  
	- Serialize results into a simple JSON schema, e.g.:
		- `geographies`: list of included geography names.  
		- `metrics`: list of records with fields such as `year`, `geo`, `median_home_value`, `median_household_income`, `median_gross_rent`, `price_to_income`, `rent_to_income`.

### Frontend: Vite + React + TypeScript

- **Framework & Tooling**  
	- Vite (`create-vite`) with the React + TypeScript template.  
	- React for component-based UI.  
	- TypeScript for type safety and clear data contracts between components.  
	- A charting library (e.g., Recharts or Chart.js via `react-chartjs-2`) for time-series and comparative charts.

- **Planned structure**  
	- `frontend/src/` – React components, hooks, and types.  
		- `App.tsx` – top-level layout and data loading.  
		- `components/` – reusable chart and UI components (e.g., `ChartHousingTrends`, `MetricCards`).  
		- `types/` – TypeScript interfaces describing the JSON data shape (e.g., `AffordabilityMetric`, `AffordabilityDataset`).  
	- `frontend/public/data/` – location where processed JSON files are placed so the app can fetch them at runtime.  
	- Standard Vite config files (`vite.config.ts`, `tsconfig.json`, etc.).

- **Data flow in the frontend**  
	- On application load, the frontend performs an HTTP GET to a static JSON endpoint (e.g., `/data/housing_affordability_timeseries.json`).  
	- The response is parsed into strongly typed objects using the TypeScript interfaces.  
	- Data is passed to visualization components that render charts comparing Fergus Falls / Otter Tail vs Minneapolis over time.

### Deployment Strategy

- **Local workflow**  
	1. Run Python scripts in `backend/src/` to regenerate processed JSON files under `backend/data/processed/`.  
	2. Copy or sync the relevant JSON files into `frontend/public/data/`.  
	3. Run the Vite dev server for local development of the React app.

- **Render deployment (static site)**  
	- The frontend is deployed as a static site on Render (or a similar platform).  
	- Build command (example): `npm install && npm run build` inside the `frontend/` directory.  
	- Publish directory: `dist/`, which includes both compiled assets and the `data/` JSON files.  
	- When the Python analysis is updated and new JSON files are committed, the site can be automatically redeployed, updating the visualizations.

This setup keeps the deployment simple enough for a free-tier portfolio project while still demonstrating a realistic separation between **analysis code** and **presentation layer**—a pattern that aligns well with how many government and analytics teams work.

