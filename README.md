# Fitbit Sleep Wrangler

Transform Fitbit sleep data to CSV. With millenium day, start time and end time as columns.

e.g.
| Millenium day | Start time | End time |
| ------------- | ---------- | -------- |
| 8024 | 20:40 | 21:00 |
| 8024 | 21:20 | 21:35 |

## Features

- Create CSV with columns:
  - Millenium day (days from 2000-01-01)
  - Sleep time
  - Wake time
- Fix timeline conflicts (beta)
