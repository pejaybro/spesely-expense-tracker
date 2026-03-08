import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export default dayjs;
