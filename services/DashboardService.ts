import { supabase } from '../lib/supabase';

export const DashboardService = {
  getDashboardByName: async (name: string) => {
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('*')
      .eq('name', name)
      .single();

    if (dashboardError) {
      throw new Error(dashboardError.message);
    }

    const { data: charts, error: chartsError } = await supabase
      .from('chart')
      .select('*')
      .eq('dashboardName', name);

    if (chartsError) {
      throw new Error(chartsError.message);
    }

    return { dashboard, charts };
  }
};


