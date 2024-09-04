export interface Project {
    _id: string;
    title: string;
    url: string;
    imageUrl: string;
    language?: 'JavaScript' | 'Python' | 'Java' | 'C#' | 'Rust' | 'Go' | 'TypeScript' | 'Solidity' | 'Move';
    description: string;
    budget: string;
    worktype: 'Security Audit' | 'Contract Audit' | 'Full Audit' | 'Invariant Testing';
    status: 'Pending' | 'Open' | 'Closed' | 'On Hold';
    startDate: string; // Use ISO 8601 date strings
    endDate?: string | null; // Use ISO 8601 date strings or null
    createdAt: string; // Use ISO 8601 date strings
  }
  