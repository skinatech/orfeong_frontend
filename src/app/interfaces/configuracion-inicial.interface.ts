export interface IConfigInicial {
    dataStatus: boolean;
    llaveCsInicial: string;
    valorCsInicial: string;
    creacionCsInicial: string;
    estadoCsInicial: number;
  }
  
  export interface IConfigParams {
    dataStatus: boolean;
    data: Array<{
      llaveCsParams: string;
      valorCsParams: string;
      creacionCsParams: string;
      estadoCsParams: number;
    }>;
  }
  