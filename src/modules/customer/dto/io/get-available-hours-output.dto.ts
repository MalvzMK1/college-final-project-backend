export type GetAvailableHoursOutputDTO = {
  days: {
    hours: {
      datetime: Date;
      isAvailable: boolean;
      availableBarbers: {
        id: string;
        name: string;
      }[];
    }[]
  }[]
}
