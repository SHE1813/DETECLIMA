// API Route: POST /api/prediction
// Recibe coordenadas geográficas (latitud y longitud) y devuelve
// una predicción climática generada por el servicio de Machine Learning.

import { NextRequest, NextResponse } from 'next/server';
import { MLServiceAdapter } from '@/infrastructure/adapters/out/MLServiceAdapter';
import { PredictionService } from '@/application/services/PredictionService';

// Adaptador que se comunica con el microservicio de ML (Python/FastAPI)
const mlAdapter = new MLServiceAdapter();
// Servicio de aplicación que orquesta la lógica de predicción climática
const predictionService = new PredictionService(mlAdapter);

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    // Convertir latitud y longitud a números flotantes
    const lat = parseFloat(body.latitude);
    const lon = parseFloat(body.longitude);

    // Validar que las coordenadas sean números válidos
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: 'latitude y longitude son requeridos' },
        { status: 400 }
      );
    }

    // Ejecutar el servicio de predicción con las coordenadas recibidas
    const prediccion = await predictionService.execute(lat, lon);
    return NextResponse.json(prediccion);
  } catch (error) {
    // Manejo de errores inesperados del servidor o del servicio ML
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
