// API Route: POST /api/chat
// Recibe un historial de mensajes y contexto climático opcional,
// y devuelve una respuesta generada por el modelo de IA (Groq).

import { NextRequest, NextResponse } from 'next/server';
import { GroqAdapter } from '@/infrastructure/adapters/out/GroqAdapter';
import { ChatbotService } from '@/application/services/ChatbotService';
import { ChatMessage } from '@/domain/entities';

// Instancia del adaptador que se comunica con la API de Groq (IA)
const aiAdapter = new GroqAdapter();
// Servicio de aplicación que orquesta la lógica del chatbot
const chatbotService = new ChatbotService(aiAdapter);

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    // Historial de mensajes de la conversación
    const messages: ChatMessage[] = body.messages;
    // Contexto climático opcional para enriquecer la respuesta del chatbot
    const weatherContext: string | undefined = body.weatherContext;

    // Validar que se envíe al menos un mensaje
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de mensajes' },
        { status: 400 }
      );
    }

    // Ejecutar el servicio del chatbot y retornar la respuesta de la IA
    const respuesta = await chatbotService.execute(messages, weatherContext);
    return NextResponse.json(respuesta);
  } catch (error) {
    // Manejo de errores inesperados del servidor
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
