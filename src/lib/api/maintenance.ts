/**
 * Maintenance ticket API endpoints.
 */

import type { MaintenanceTicket, TicketComment } from '@/lib/types';
import type { CreateTicketData, UpdateTicketData } from '@/lib/types/api';
import { BaseAPIClient } from './client';

export class MaintenanceAPI extends BaseAPIClient {
  async createMaintenanceTicket(data: CreateTicketData): Promise<MaintenanceTicket> {
    return this.post<MaintenanceTicket>('/maintenance', data);
  }

  async getMaintenanceTicket(id: string): Promise<MaintenanceTicket> {
    return this.get<MaintenanceTicket>(`/maintenance/${id}`);
  }

  async updateMaintenanceTicket(id: string, data: UpdateTicketData): Promise<MaintenanceTicket> {
    return this.patch<MaintenanceTicket>(`/maintenance/${id}`, data);
  }

  async addTicketComment(ticketId: string, content: string): Promise<TicketComment> {
    return this.post<TicketComment>(`/maintenance/${ticketId}/comments`, { content });
  }
}
