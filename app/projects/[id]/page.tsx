import Sidebar from '@/app/components/sidebar'
import { MongoClient, ObjectId } from 'mongodb'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectDetailProps {
  params: {
    id: string
  }
}

async function fetchProjectById (id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!)
  const db = client.db()
  const project = await db
    .collection('projects')
    .findOne({ _id: new ObjectId(id) })
  client.close()
  return project
}

export default async function ProjectDetail ({ params }: ProjectDetailProps) {
  const project = await fetchProjectById(params.id)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181e2e] to-[#1f243c] pt-4'>
      <div className='flex flex-row ml-[25%] p-5 text-white'>
        <Link href={'/'}>All Audits</Link> <span className='mx-2'>{'>'}</span>{' '}
        {project.title}
      </div>
      <Sidebar />

      <div className='flex flex-col border-2 rounded-xl shadow-2xl ml-[25%] mr-[10%] p-4'>
        <div className='flex flex-row ml-5 items-center mt-5'>
          <div className='flex p-3'>
            <Image
              className='rounded-full'
              objectFit='contain'
              src={project.imageUrl}
              alt={project.title}
              width={100}
              height={100}
            />
          </div>
          <div className='flex flex-col p-3 gap-3'>
            <div className='p-2 rounded-lg w-fit bg-[#59627f]'>
              {project.status}
            </div>
            <div className='text-3xl font-bold text-white'>{project.title}</div>
            <a
              href={
                project.url.startsWith('http')
                  ? project.url
                  : `https://${project.url}`
              }
              className='text-white text-sm'
              target='_blank'
              rel='noopener noreferrer'
            >
              {project.url}
            </a>
          </div>

          <div className='flex flex-col p-5 items-center h-fit  rounded-lg ml-[15%] bg-[#59627f]'>
            <div className='text-white text-2xl'>
              {new Date(project.startDate).toLocaleDateString()} -{' '}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : 'N/A'}
            </div>
            <div className='text-white'>Start and End date</div>
          </div>

          <div className='flex flex-col p-5 text-white items-center h-fit rounded-lg ml-[15%] bg-[#59627f]'>
            {project.budget}
            <div>Budget</div>
          </div>
        </div>
        <hr className='my-10' />

        <div className='flex flex-row ml-5 justify-between'>
          <div className='flex flex-col p-3'>
            <div className='text-white text-2xl font-bold'>Work Type</div>
            <div className='flex flex-col p-2 mt-2 text-white items-center w-fit rounded-lg bg-[#59627f]'>
              {project.worktype}
            </div>
          </div>
          <div className='flex flex-col p-3'>
            <div className='text-white text-2xl font-bold'>
              Programming Language
            </div>
            <div className='flex flex-col p-2 mt-2 text-white items-center w-fit rounded-lg bg-[#59627f]'>
              {project.language}
            </div>
          </div>
        </div>
        <div className='text-white p-3 ml-5 break-words'>
          {project.description}
        </div>
      </div>
    </div>
  )
}
