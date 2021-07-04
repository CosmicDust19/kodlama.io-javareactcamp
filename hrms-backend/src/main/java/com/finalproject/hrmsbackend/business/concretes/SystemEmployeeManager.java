package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SystemEmployeeManager implements SystemEmployeeService {

    private final UserDao userDao;
    private final SystemEmployeeDao systemEmployeeDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<SystemEmployee>> getAll() {
        return new SuccessDataResult<>("Success", systemEmployeeDao.findAll());
    }

    @Override
    public DataResult<Boolean> existsByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.existsByEmailAndPassword(email, password));
    }

    @Override
    public DataResult<Boolean> existsByEmail(String email) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.existsByEmail(email));
    }

    @Override
    public DataResult<SystemEmployee> getById(int id) {
        if (id <= 0 || !systemEmployeeDao.existsById(id)){
                return new ErrorDataResult<>("id does not exist");
        }
        return new SuccessDataResult<>("Success", systemEmployeeDao.getById(id));
    }

    @Override
    public DataResult<SystemEmployee> getByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(SystemEmployeesAddDto systemEmployeesAddDto) {
        SystemEmployee systemEmployee = modelMapper.map(systemEmployeesAddDto, SystemEmployee.class);
        systemEmployeeDao.save(systemEmployee);
        return new SuccessResult("System Employee Saved");
    }

    @Override
    public DataResult<Boolean> deleteById(int id){
        if (id <= 0 || !systemEmployeeDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        systemEmployeeDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateEmail(String email, int id){
        if (email != null) email = email.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !systemEmployeeDao.existsById(id))
            errors.put("id", "does not exist");
        if (email == null || email.length() < 4 || email.length() > 100 ||
                !Pattern.matches("^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$", email))
            errors.put("email", "invalid email");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (userDao.existsByEmail(email))
            return new ErrorResult("email in use");
        systemEmployeeDao.updateEmail(email, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updatePassword(String password, String oldPassword, int id){
        if (password != null) password = password.trim();
        Map<String, String> errors = new HashMap<>();
        if (!userDao.existsByIdAndPassword(id, oldPassword))
            errors.put("oldPassword", "wrong");
        if (id <= 0 || !systemEmployeeDao.existsById(id))
            errors.put("id", "does not exist");
        if (password == null || password.length() < 6 || password.length() > 20)
            errors.put("password", "should be a text between 6 and 20 long");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        systemEmployeeDao.updatePassword(password, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateFirstName(String firstName, int id){
        if (firstName != null) firstName = firstName.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !systemEmployeeDao.existsById(id))
            errors.put("id", "does not exist");
        if (firstName == null || firstName.length() < 2 || firstName.length() > 50)
            errors.put("firstName", "invalid firstName");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        systemEmployeeDao.updateFirstName(firstName, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateLastName(String lastName, int id){
        if (lastName != null) lastName = lastName.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !systemEmployeeDao.existsById(id))
            errors.put("id", "does not exist");
        if (lastName == null || lastName.length() < 2 || lastName.length() > 50)
            errors.put("lastName", "invalid lastName");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        systemEmployeeDao.updateLastName(lastName, id);
        return new SuccessResult("Success");
    }

}
