import { NextResponse } from 'next/server';
import Project from '../../models/project'; // Adjust the import path if needed
import dbConnect from '../../lib/dbconnect';


export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all projects from the Project collection
    const projects = await Project.find().exec();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);

    // Return a generic error response
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}


