'use client';

import { useState } from 'react';
import AdminAuthWrapper from '../AdminAuthWrapper';
import ContentItemsTable from './components/ContentItemsTable';
import ContentLoadingState from './components/ContentLoadingState';
import ContentManagementHeader from './components/ContentManagementHeader';
import ContentModal from './components/ContentModal';
import ContentOverviewStats from './components/ContentOverviewStats';
import ContentTabNav from './components/ContentTabNav';
import { useContentManagement } from './hooks/useContentManagement';
import type { ContentFormData, ContentItem, ContentModalType, ContentTab } from './types';

function ContentManagementContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>('overview');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ContentModalType>('create');
  const [formData, setFormData] = useState<ContentFormData>({});

  const {
    contentItems,
    toolUpdates,
    newsItems,
    loading,
    publishing,
    publishContent,
    createContent,
    updateContent,
    deleteContent,
  } = useContentManagement();

  const openCreateModal = () => {
    setModalType('create');
    setFormData({});
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleView = (item: ContentItem) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setModalType('edit');
    setFormData(item);
    setShowModal(true);
  };

  const handleCreate = async (data: ContentFormData) => {
    const success = await createContent(data);
    if (success) setShowModal(false);
  };

  const handleUpdate = async (id: string, data: ContentFormData) => {
    const success = await updateContent(id, data);
    if (success) setShowModal(false);
  };

  if (loading) {
    return <ContentLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ContentManagementHeader onCreateClick={openCreateModal} />
      <ContentTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ContentOverviewStats
            newsItems={newsItems}
            toolUpdates={toolUpdates}
            contentItems={contentItems}
          />
        )}

        <ContentItemsTable
          activeTab={activeTab}
          items={contentItems}
          publishing={publishing}
          onView={handleView}
          onEdit={handleEdit}
          onPublish={publishContent}
          onDelete={deleteContent}
        />
      </div>

      {showModal && (
        <ContentModal
          modalType={modalType}
          selectedItem={selectedItem}
          formData={formData}
          onClose={() => setShowModal(false)}
          onFormChange={setFormData}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default function ContentManagementClient() {
  return (
    <AdminAuthWrapper>
      {() => <ContentManagementContent />}
    </AdminAuthWrapper>
  );
}
