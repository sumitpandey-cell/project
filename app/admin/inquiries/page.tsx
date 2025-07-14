'use client';

import React, { useEffect, useState } from 'react';
import { getInquiries, StudentInquiry } from '@/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Phone, Mail, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<StudentInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<StudentInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        setInquiries(data);
        setFilteredInquiries(data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  useEffect(() => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline">Contacted</Badge>;
      case 'admitted':
        return <Badge variant="default">Admitted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Inquiries</h1>
        <p className="text-gray-600">Manage admission inquiries and applications</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="admitted">Admitted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'pending').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'contacted').length}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admitted</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'admitted').length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Grid */}
      {filteredInquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{inquiry.fullName}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(inquiry.submittedAt, 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">{inquiry.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">{inquiry.interestedCourses}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <span className="text-xs text-gray-600 line-clamp-2">{inquiry.address}</span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Parent: {inquiry.parentName}</p>
                    <p className="text-xs text-gray-500">Phone: {inquiry.parentPhone}</p>
                  </div>

                  {inquiry.message && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        "{inquiry.message}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Student inquiries will appear here when submitted'
            }
          </p>
        </div>
      )}
    </div>
  );
}