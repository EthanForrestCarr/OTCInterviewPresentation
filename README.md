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

### 2. Data Sources (Implemented)

The project relies on **public government datasets** that are realistic for county-level analysis and are already wired into the current dashboard.

#### American Community Survey (ACS)

- **Source:** U.S. Census Bureau – ACS 5-year estimates, downloaded as CSVs from data.census.gov.  
- **Years covered:** 2013–2023 (inclusive).  
- **Tables used:**  
	- `B19013` – Median household income (in the past 12 months).  
	- `B25077` – Median value (owner-occupied housing units).  
	- `B25064` – Median gross rent.  
- **Geographies used:**  
	- Fergus Falls city, Minnesota.  
	- Otter Tail County, Minnesota.  
	- Minneapolis city, Minnesota.  
	- Hennepin County, Minnesota.

From these tables, the backend computes:

- Median home value time series.  
- Median gross rent time series.  
- Median household income time series.  
- Price-to-income ratio = median home value / median household income.  
- Rent-to-income share = (median gross rent × 12) / median household income.

#### HUD Fair Market Rents (planned enhancement)

- **Source:** U.S. Department of Housing and Urban Development (HUD) Fair Market Rents (FMR).  
- **Status:** Loader is scaffolded in `backend/src/load_hud.py`, but HUD FMR data is not yet surfaced in the live dashboard. This is a natural future enhancement.

#### Optional local or state data (stretch goals)

- County-level parcel or assessment data (Otter Tail, Hennepin) for trends in assessed value.  
- Minnesota state or local open data (e.g., building permits, housing stock) if time allows.

The emphasis remains on **comparable affordability metrics across rural and metro geographies**.

### 3. Analytical Steps (Implemented Pipeline)

The current implementation follows this concrete pipeline:

1. **Gather and ingest data**  
	- Download ACS CSV exports for each year and table into year-specific folders (e.g., `2013/ACSDT5Y2013.B19013...csv`).  
	- (Planned) Add HUD FMR Excel files alongside ACS data.

2. **Clean and standardize**  
	- Use `backend/src/load_acs.py` to read the ACS CSVs. These files are in a "wide-by-geo" format, with one row per metric and columns like `Fergus Falls city, Minnesota!!Estimate`.  
	- Select the median estimate row for each table and extract all `!!Estimate` columns.  
	- Normalize values to numeric types, handling commas, missing data, and `NaN` values.

3. **Engineer affordability metrics**  
	- For each `(year, geography)` pair, compute:  
		- `median_home_value` (from `B25077`).  
		- `median_gross_rent` (from `B25064`).  
		- `median_household_income` (from `B19013`).  
		- `price_to_income = median_home_value / median_household_income`.  
		- `rent_to_income = (median_gross_rent × 12) / median_household_income`.

4. **Prepare data for visualization**  
	- Use `backend/src/build_affordability_dataset.py` to merge metrics across tables and years.  
	- Export a single tidy JSON file, `backend/data/processed/housing_affordability_timeseries.json`, with schema:  
		- `geographies`: list of included geography names.  
		- `metrics`: list of records, each like:  
			- `year`, `geo_name`, `median_household_income`, `median_home_value`, `median_gross_rent`, `price_to_income`, `rent_to_income`, `hud_fmr_2br` (optional, currently `null`).  
	- Copy or sync this JSON file into `public/data/housing_affordability_timeseries.json` for the frontend.

5. **Visualize and interpret**  
	- The React app fetches `/data/housing_affordability_timeseries.json` at runtime.  
	- Charts and narrative components render comparisons of Fergus Falls / Otter Tail vs Minneapolis / Hennepin over time.  
	- The dashboard surfaces both raw price levels and affordability ratios, along with interview-ready narrative text.

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
	- Core libraries: `pandas`, `numpy`, and `openpyxl` (for potential HUD Excel inputs).  
	- Dependencies are listed in `backend/requirements.txt`.

- **Structure (implemented)**  
	- `backend/src/config.py` – project paths, list of years, and target geographies.  
	- `backend/src/load_acs.py` – ACS loader tailored to wide-by-geo CSV exports.  
	- `backend/src/load_hud.py` – scaffolded HUD FMR loader (future enhancement).  
	- `backend/src/build_affordability_dataset.py` – merges metrics and writes the JSON dataset.  
	- `backend/data/processed/` – processed outputs, including `housing_affordability_timeseries.json`.

- **Responsibility**  
	- Load ACS CSVs for the four geographies and specified years.  
	- Compute affordability metrics (price-to-income, rent-to-income, trends).  
	- Serialize results into a JSON schema consumed directly by the frontend.

### Frontend: Vite + React + TypeScript

- **Framework & Tooling**  
	- Vite (React + TypeScript template).  
	- React for component-based UI.  
	- TypeScript for type safety and clear data contracts between components.  
	- Recharts for time-series and comparative charts.

- **Structure (implemented)**  
	- `src/App.tsx` – top-level layout, data loading, narrative sections.  
	- `src/components/MedianHomeValueChart.tsx` – multi-line chart of median home values over time.  
	- `src/components/PriceToIncomeChart.tsx` – multi-line chart of price-to-income ratios over time.  
	- `src/components/RentToIncomeChart.tsx` – multi-line chart of rent-to-income shares over time.  
	- `public/data/housing_affordability_timeseries.json` – static JSON file served by Vite.

- **Data flow in the frontend**  
	- On application load, `App.tsx` fetches `/data/housing_affordability_timeseries.json`.  
	- The response is parsed into strongly typed objects (affordability metrics by year and geography).  
	- Data is passed to chart components that render comparisons of Fergus Falls / Otter Tail vs Minneapolis / Hennepin.  
	- Narrative sections ("How to read this page" and "Key takeaways for Otter Tail County") guide non-technical readers through interpretation.

### Local Setup & Run Instructions

**Backend: regenerate processed JSON**

```pwsh
cd "c:\Users\ethan\Projects\Codecademy-Data-Analysis\backend"
python -m src.build_affordability_dataset
```

This command reads the ACS CSVs, recomputes affordability metrics, and writes `backend/data/processed/housing_affordability_timeseries.json`.

**Copy JSON into the frontend public data folder**

```pwsh
cd "c:\Users\ethan\Projects\Codecademy-Data-Analysis"
copy backend\data\processed\housing_affordability_timeseries.json public\data\housing_affordability_timeseries.json
```

**Frontend: install dependencies and run the dev server**

```pwsh
cd "c:\Users\ethan\Projects\Codecademy-Data-Analysis"
npm install
npm run dev
```

This starts the Vite dev server and serves both the React app and the JSON data. The site can later be built (`npm run build`) and deployed as a static site.

This setup keeps deployment simple enough for a free-tier portfolio project while still demonstrating a realistic separation between **analysis code** and **presentation layer**—a pattern that aligns well with how many government and analytics teams work.

