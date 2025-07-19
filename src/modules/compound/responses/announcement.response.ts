export function AnnouncementResponse(announcement: any) {
  return {
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    type: announcement.type,
    answers: announcement.answers,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
  };
}
