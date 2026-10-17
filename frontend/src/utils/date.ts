import dayjs from 'dayjs';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.locale('en');

export const formatDateTime = (iso: string): string =>
  dayjs(iso).format('D MMMM YYYY [at] h:mm A');

export const formatDate = (dateStr: string): string =>
  dayjs(dateStr).format('D MMMM YYYY');

export const formatAdminDateTime = (iso: string): string =>
  dayjs(iso).format('YYYY-MM-DD\nhh:mm A');

export const formatAdminDate = (dateStr: string): string =>
  dayjs(dateStr).format('YYYY-MM-DD');
