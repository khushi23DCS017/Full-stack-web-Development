import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { userAPI } from '../../utils/api';
import { withErrorHandling } from '../../utils/errorHandler';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingState from '../../components/ui/LoadingState';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await withErrorHandling(
        () => userAPI.getAllUsers(),
        { customErrorMessage: 'Failed to fetch users' }
      );
      setUsers(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await withErrorHandling(
        () => userAPI.deleteUser(userToDelete._id),
        { 
          showSuccessToast: true,
          successMessage: `User ${userToDelete.name} deleted successfully`,
          customErrorMessage: 'Failed to delete user'
        }
      );
      // Refresh the users list
      fetchUsers();
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </span>
      ) 
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/edit/${row._id}`);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Users Management">
        <Link to="/users/new">
          <Button>Add New User</Button>
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingState />
      ) : (
        <Table
          columns={columns}
          data={users}
          onRowClick={(row) => navigate(`/users/edit/${row._id}`)}
          emptyMessage="No users found"
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default UsersList;