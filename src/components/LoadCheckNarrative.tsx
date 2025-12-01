export function LoadCheckNarrative() {
  return (
    <section>
      <h2>Load and Check Data</h2>
      <p>
        Before building charts, the processed dataset is loaded back into Python to verify
        that it is ready for analysis and presentation. The main JSON dataset contains
        44 records (4 geographies × 11 years, 2013–2023), each with income, price, rent,
        and affordability metrics.
      </p>
      <p>
        For each numeric field, the pipeline checks for missing values and basic
        plausibility. All ACS-derived metrics
        (<code>median_household_income</code>, <code>median_home_value</code>,
        <code>median_gross_rent</code>, <code>price_to_income</code>,
        <code>rent_to_income</code>, and <code>owner_cost_burdened_share</code>) are fully
        populated across all 44 (year, geography) combinations, and their ranges are
        consistent with expectations for county- and city-level data (for example, home
        values in the low hundreds of thousands and rent-to-income ratios in the
        14–20% range). The only systematic missingness occurs in <code>hud_fmr_2br</code>,
        which is <code>null</code> for 2022–2023 due to malformed HUD workbooks documented in
        the data quality section.
      </p>
      <p>
        This quick load-and-check step ensures that the dashboard is built on a clean,
        internally consistent dataset, and it gives stakeholders confidence that apparent
        trends in the charts are not artifacts of parsing errors or unhandled missing
        data.
      </p>
    </section>
  )
}
