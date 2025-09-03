import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Force Node.js runtime for database operations
export const runtime = 'nodejs'

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Unauthorized - creators only' },
        { status: 401 }
      )
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: session.user.id },
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      )
    }

    const personas = await prisma.persona.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      personas,
      defaultPersonaId: creator.defaultPersonaId,
    })
  } catch (error) {
    console.error('Get personas error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Unauthorized - creators only' },
        { status: 401 }
      )
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: session.user.id },
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      systemPrompt,
      temperature = 0.7,
      modelProvider = 'OPENAI',
      modelName = 'gpt-4o-mini',
      embeddingModel = 'text-embedding-3-small',
      isDefault = false,
    } = body

    // Validate input
    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: 'Name and system prompt are required' },
        { status: 400 }
      )
    }

    if (temperature < 0 || temperature > 2) {
      return NextResponse.json(
        { error: 'Temperature must be between 0 and 2' },
        { status: 400 }
      )
    }

    if (!['OPENAI', 'ANTHROPIC'].includes(modelProvider)) {
      return NextResponse.json(
        { error: 'Model provider must be OPENAI or ANTHROPIC' },
        { status: 400 }
      )
    }

    // Create persona
    const persona = await prisma.persona.create({
      data: {
        creatorId: creator.id,
        name,
        systemPrompt,
        temperature,
        modelProvider,
        modelName,
        embeddingModel,
      },
    })

    // If this is set as default or is the first persona, update creator
    if (isDefault || !creator.defaultPersonaId) {
      await prisma.creator.update({
        where: { id: creator.id },
        data: { defaultPersonaId: persona.id },
      })
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'persona_created',
        target: `persona:${persona.id}`,
        metadata: {
          personaName: name,
          modelProvider,
          modelName,
          isDefault,
        },
      },
    })

    return NextResponse.json({
      persona,
      message: 'Persona created successfully',
    })
  } catch (error) {
    console.error('Create persona error:', error)
    return NextResponse.json(
      { error: 'Failed to create persona' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Unauthorized - creators only' },
        { status: 401 }
      )
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: session.user.id },
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      id,
      name,
      systemPrompt,
      temperature,
      modelProvider,
      modelName,
      embeddingModel,
      isDefault,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Persona ID is required' },
        { status: 400 }
      )
    }

    // Check if persona belongs to creator
    const existingPersona = await prisma.persona.findFirst({
      where: {
        id,
        creatorId: creator.id,
      },
    })

    if (!existingPersona) {
      return NextResponse.json(
        { error: 'Persona not found or access denied' },
        { status: 404 }
      )
    }

    // Update persona
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt
    if (temperature !== undefined) updateData.temperature = temperature
    if (modelProvider !== undefined) updateData.modelProvider = modelProvider
    if (modelName !== undefined) updateData.modelName = modelName
    if (embeddingModel !== undefined) updateData.embeddingModel = embeddingModel

    const persona = await prisma.persona.update({
      where: { id },
      data: updateData,
    })

    // Update default if requested
    if (isDefault) {
      await prisma.creator.update({
        where: { id: creator.id },
        data: { defaultPersonaId: persona.id },
      })
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'persona_updated',
        target: `persona:${persona.id}`,
        metadata: {
          personaName: persona.name,
          isDefault,
        },
      },
    })

    return NextResponse.json({
      persona,
      message: 'Persona updated successfully',
    })
  } catch (error) {
    console.error('Update persona error:', error)
    return NextResponse.json(
      { error: 'Failed to update persona' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Unauthorized - creators only' },
        { status: 401 }
      )
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: session.user.id },
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const personaId = searchParams.get('id')

    if (!personaId) {
      return NextResponse.json(
        { error: 'Persona ID is required' },
        { status: 400 }
      )
    }

    // Check if persona belongs to creator
    const persona = await prisma.persona.findFirst({
      where: {
        id: personaId,
        creatorId: creator.id,
      },
    })

    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found or access denied' },
        { status: 404 }
      )
    }

    // Don't allow deleting the default persona if it's the only one
    const personaCount = await prisma.persona.count({
      where: { creatorId: creator.id },
    })

    if (personaCount === 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only persona' },
        { status: 400 }
      )
    }

    // If deleting the default persona, set another as default
    if (creator.defaultPersonaId === personaId) {
      const otherPersona = await prisma.persona.findFirst({
        where: {
          creatorId: creator.id,
          id: { not: personaId },
        },
      })

      if (otherPersona) {
        await prisma.creator.update({
          where: { id: creator.id },
          data: { defaultPersonaId: otherPersona.id },
        })
      }
    }

    // Delete persona
    await prisma.persona.delete({
      where: { id: personaId },
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'persona_deleted',
        target: `persona:${personaId}`,
        metadata: {
          personaName: persona.name,
        },
      },
    })

    return NextResponse.json({
      message: 'Persona deleted successfully',
    })
  } catch (error) {
    console.error('Delete persona error:', error)
    return NextResponse.json(
      { error: 'Failed to delete persona' },
      { status: 500 }
    )
  }
}