import type { NextApiRequest, NextApiResponse } from 'next';

interface ApplicationData {
  name: string;
  email: string;
  description: string;
  socialMedia: string;
  experience: string;
}

interface ApplicationRow extends ApplicationData {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// In a real application, this would be stored in a database
// For now, we'll simulate storage with in-memory data and logging
const applications: ApplicationRow[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, description, socialMedia, experience }: ApplicationData = req.body;

    // Validate required fields
    if (!name || !email || !description || !experience) {
      return res.status(400).json({ 
        message: 'Missing required fields. Name, email, description, and experience are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Validate experience level
    const validExperienceLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validExperienceLevels.includes(experience)) {
      return res.status(400).json({ 
        message: 'Invalid experience level' 
      });
    }

    // Create application record
    const application: ApplicationRow = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      description: description.trim(),
      socialMedia: socialMedia ? socialMedia.trim() : '',
      experience,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Store application (in real app, this would be database insertion)
    applications.push(application);

    // Log the application for debugging/monitoring
    console.log('New application received:', {
      id: application.id,
      name: application.name,
      email: application.email,
      experience: application.experience,
      submittedAt: application.submittedAt
    });

    // Return success response
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id,
      submittedAt: application.submittedAt
    });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
}

// Helper function to generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Export for potential use in other parts of the application
export { applications };
export type { ApplicationData, ApplicationRow };