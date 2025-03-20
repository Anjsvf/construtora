import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Project from '../models/Project';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    console.log('Salvando imagem:', file.filename);
    console.log('Caminho completo:', path.join(__dirname, '../../uploads', file.filename));
    
    const imagePath = `/uploads/${file.filename}`;
    console.log('Caminho salvo no banco:', imagePath);

    const project = await Project.create({
      title,
      description,
      image: imagePath,
      status: 'Em andamento',
      lastUpdate: new Date()
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const file = req.file;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    project.title = title || project.title;
    project.description = description || project.description;
    
    // Atualizar status, se fornecido
    if (status && (status === 'Em andamento' || status === 'Concluído')) {
      project.status = status;
      project.lastUpdate = new Date();
    }

    // If a new image is uploaded, update the image and delete the old one
    if (file) {
      // Delete the old image if it exists
      if (project.image) {
        const oldImagePath = path.join(__dirname, '../../', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      project.image = `/uploads/${file.filename}`;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private/Admin
export const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status || (status !== 'Em andamento' && status !== 'Concluído')) {
      return res.status(400).json({ 
        message: 'Status inválido. Deve ser "Em andamento" ou "Concluído".' 
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    project.status = status;
    project.lastUpdate = new Date();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Erro ao atualizar status do projeto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Update project's lastUpdate date
// @route   PATCH /api/projects/:id/update-date
// @access  Private/Admin
export const updateProjectDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    
    // Validar formato da data (opcional)
    const updateDate = date ? new Date(date) : new Date();
    
    if (isNaN(updateDate.getTime())) {
      return res.status(400).json({ message: 'Data inválida' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    project.lastUpdate = updateDate;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Erro ao atualizar data do projeto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete the image file if it exists
    if (project.image) {
      const imagePath = path.join(__dirname, '../../', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 