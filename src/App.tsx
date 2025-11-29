import { useEffect, useState } from 'react'
import './App.css'

type AffordabilityMetric = {
  year: number
  geo_name: string
  median_household_income: number | null
  median_home_value: number | null
  median_gross_rent: number | null
  price_to_income: number | null
  rent_to_income: number | null
  hud_fmr_2br?: number | null
}

type AffordabilityDataset = {
  geographies: string[]
  metrics: AffordabilityMetric[]
}

function App() {
  const [data, setData] = useState<AffordabilityMetric[] | null>(null)
  const [geographies, setGeographies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const res = await fetch('/data/housing_affordability_timeseries.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as AffordabilityDataset
        setData(json.metrics)
        setGeographies(json.geographies)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <main className="app-container">Loading housing affordability data…</main>
  }

  if (error) {
    return (
      <main className="app-container">
        <p style={{ color: 'red' }}>Error loading data: {error}</p>
      </main>
    )
  }

  if (!data || data.length === 0) {
    return <main className="app-container">No data available.</main>
  }

  return (
    <main className="app-container">
      <h1>Housing Affordability: Otter Tail vs Minneapolis</h1>
      <p>
        Data source: ACS 5-year estimates (2013–2023) for Fergus Falls, Otter Tail
        County, Minneapolis, and Hennepin County.
      </p>

      <section>
        <h2>Quick Peek (raw records)</h2>
        <p>
          Loaded {data.length} records for {geographies.length} geographies.
        </p>
        <pre className="data-preview">
          {JSON.stringify(data.slice(0, 8), null, 2)}
        </pre>
      </section>
    </main>
  )
}

export default App
