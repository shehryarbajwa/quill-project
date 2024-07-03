import { supabase } from '../lib/supabase';

interface ChartDataPoint {
  date: string;
  value: number;
}

export const ChartService = {
  getChartById: async (id: string, from?: string, to?: string) => {
    try {
      const { data: chart, error: chartError } = await supabase
        .from('chart')
        .select('*')
        .eq('id', id)
        .single();

      if (chartError) {
        throw new Error(chartError.message);
      }

      if (!chart) {
        throw new Error('Chart not found');
      }

      let modifiedQuery = chart.sqlquery;

      if (from && to && chart.dateField) {
        const { table, field } = chart.dateField;
        modifiedQuery = `
          WITH date_filtered_data AS (
            SELECT * FROM ${table}
            WHERE ${field} BETWEEN '${from}' AND '${to}'
          )
          ${modifiedQuery.replace(new RegExp(`\\b${table}\\b`, 'g'), 'date_filtered_data')}
        `;
      }


      const { data: queryResults, error: queryError } = await supabase
        .rpc('execute_sql_query', { query: modifiedQuery });

      if (queryError) {
        throw new Error(queryError.message);
      }


      let parsedResults: ChartDataPoint[] = [];
      try {
        parsedResults = queryResults.map((row: { result: { date: Date, merchant: string, total: number } }) => {
          const { date, merchant, total } = row.result;
          return {
            date,
            total,
            merchant
          };
        });
      } catch (parseError) {
        throw new Error('Error parsing query results');
      }

      return { chart, data: parsedResults };
    } catch (error) {
      throw new Error(`Error fetching chart: ${error}`);
    }
  },
};
