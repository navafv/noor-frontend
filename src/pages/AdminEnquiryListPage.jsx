import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryList from '../components/EnquiryList.jsx';
import { Plus } from 'lucide-react';

function AdminEnquiryListPage() {
  // This page just needs to render the list component.
  // The EnquiryList component will handle its own fetching,
  // filtering, and pagination.

  return (
    <>
      <PageHeader title="Manage Enquiries">
        {/* We can add an "Add Enquiry" button here later if needed
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Enquiry
          </button>
        */}
      </PageHeader>
      
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <EnquiryList 
            showPagination={true} 
            showFilters={true} 
          />
        </div>
      </main>
    </>
  );
}

export default AdminEnquiryListPage;