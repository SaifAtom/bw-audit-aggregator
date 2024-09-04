import Image from 'next/image'
import Link from 'next/link'
import { Project } from '../../types/project'; // Import the Project type

interface ProjectCardProps extends Project {
  onClick?: () => void; // Optional handler for clicks
}


const ProjectCard = ({
  _id,
  title,
  description,
  imageUrl,
  url,
  language,
  budget,
  worktype,
  status,
  startDate,
  endDate,
  createdAt
}: ProjectCardProps) => {
  return (
    <div className='flex flex-row justify-between bg-[#2A2F49] hover:bg-[#59627F] transition-colors duration-200 rounded-xl shadow-md px-5 py-3'>
      <div className='flex flex-col '>
        <div className='flex flex-row'>
          <div className='p-2'>
            <Image
              className='rounded-full'
              src={imageUrl}
              alt={title}
              width={120}
              height={120}
              objectFit='contain'
            />
          </div>
          <div className='flex flex-col mt-3 ml-3'>
            <div className='text-3xl font-bold'>{title}</div>
            <a
              href={
                url.startsWith('http')
                  ? url
                  : `https://${url}`
              }
              className='text-white text-sm'
              target='_blank'
              rel='noopener noreferrer'
            >
              {url}
            </a>
          </div>
        </div>
        <div className='flex flex-row p-2 gap-3'>
          <div className='flex flex-row p-2 rounded-lg bg-[#59627f] hover:bg-[#2a2f49] transition-colors duration-200'>
            <Image
              src='/icons/wallet.svg'
              alt='search'
              width={20}
              height={20}
            />
            <button className='mx-2'>{budget}</button>
          </div>
          <div className='flex flex-row p-2 rounded-lg bg-[#59627f] hover:bg-[#2a2f49] transition-colors duration-200'>
            <Image
              src='/icons/date-range.svg'
              alt='search'
              width={20}
              height={20}
            />
            <button className='mx-2'>
              {new Date(startDate).toLocaleDateString()} -{' '}
              {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
            </button>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center gap-3'>
        <div className='flex flex-row px-5 py-2 rounded-lg bg-[#95adff] justify-center '>
          {status}
        </div>
        <Link
          href={`/projects/${_id}`}
          className='text-white hover:underline text-xl'
          target='_blank'
          rel='noopener noreferrer'
        >
          View Project
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
