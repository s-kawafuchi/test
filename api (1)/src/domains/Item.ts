import { RowDataPacket } from 'mysql2/promise';

export interface Item extends RowDataPacket {
  id: number;
  name: string;
  created?: Date;
}

export interface Shift extends RowDataPacket {
  year: number;
  month: number;
  data: number;
  shift: number;
  staffid: number;
}

export interface Book extends RowDataPacket {
  year: number;
  month: number;
  data: number;
  staffid: number;
  time: number;
}
