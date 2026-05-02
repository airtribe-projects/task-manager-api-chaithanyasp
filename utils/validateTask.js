const validateTask = (data, isUpdate = false) => {
  const { title, description, completed } = data;

  if (!isUpdate) {
    if (!title || !description) {
      return 'Title and description are required';
    }
  }

  if (title !== undefined && title.trim() === '') {
    return 'Title cannot be empty';
  }

  if (description !== undefined && description.trim() === '') {
    return 'Description cannot be empty';
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return 'Completed must be a boolean';
  }

  return null;
};

module.exports = validateTask;