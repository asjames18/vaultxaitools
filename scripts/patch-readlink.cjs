/**
 * Windows exFAT/FAT32 workaround: fs.readlink returns EISDIR instead of
 * EINVAL for regular files. Patch both sync and async variants to convert
 * EISDIR → null (treat as "not a symlink") so Next.js build tracing works.
 */
const fs = require('fs');
const fsPromises = fs.promises;

// Patch async readlink
const origReadlink = fsPromises.readlink.bind(fsPromises);
fsPromises.readlink = async function patchedReadlink(path, options) {
  try {
    return await origReadlink(path, options);
  } catch (err) {
    if (err.code === 'EISDIR') {
      const e = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      e.code = 'EINVAL';
      e.syscall = 'readlink';
      e.path = path;
      throw e;
    }
    throw err;
  }
};

// Patch sync readlink
const origReadlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = function patchedReadlinkSync(path, options) {
  try {
    return origReadlinkSync(path, options);
  } catch (err) {
    if (err.code === 'EISDIR') {
      const e = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      e.code = 'EINVAL';
      e.syscall = 'readlink';
      e.path = path;
      throw e;
    }
    throw err;
  }
};
