// API Route: GET /api/weather?lat={latitud}&lon={longitud}
// Recibe coordenadas geográficas como query params y devuelve
// los datos climáticos actuales obtenidos desde Open-Meteo.

import { NextRequest, NextResponse } from 'next/server';
import { OpenMeteoAdapter } from '@/infrastructure/adapters/out/OpenMeteoAdapter';
import { ClimateService } from '@/application/services/ClimateService';

// Adaptador que se comunica con la API pública de Open-Meteo
const weatherAdapter = new OpenMeteoAdapter();
// Servicio de aplicación que orquesta la obtención de datos climáticos
const climateService = new ClimateService(weatherAdapter);

export async function GET(request: NextRequest) {
  // Extraer los parámetros de consulta de la URL
  const { searchParams } = request.nextUrl;
  // Convertir latitud y longitud a números flotantes
  const lat = parseFloat(searchParams.get('lat') || '');
  const lon = parseFloat(searchParams.get('lon') || '');

  // Validar que las coordenadas sean números válidos
  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'Parámetros lat y lon son requeridos' },
      { status: 400 }
    );
  }

  try {
    // Ejecutar el servicio climático con las coordenadas recibidas
    const clima = await climateService.execute(lat, lon);
    return NextResponse.json(clima);
  } catch (error) {
    // Manejo de errores inesperados del servidor o de la API externa
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
