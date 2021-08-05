package ch.sbb.atlas.controller;

import ch.sbb.atlas.entity.TimetableFieldNumberVersion;
import ch.sbb.atlas.enumaration.Status;
import ch.sbb.atlas.repository.TimetableFieldNumberVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class TimetableFieldNumberVersionController {

    private final TimetableFieldNumberVersionRepository timetableFieldNumberVersionRepository;

    @Autowired
    public TimetableFieldNumberVersionController(
        TimetableFieldNumberVersionRepository timetableFieldNumberVersionRepository) {
        this.timetableFieldNumberVersionRepository = timetableFieldNumberVersionRepository;
    }

    @RequestMapping(value="/create", method= RequestMethod.GET)
    public String create() {
        TimetableFieldNumberVersion timetableFieldNumberVersion = new TimetableFieldNumberVersion();
        timetableFieldNumberVersion.setNumber("asdsad");
        timetableFieldNumberVersion.setStatus(Status.ACTIVE);
        timetableFieldNumberVersion.setCreationDate(LocalDateTime.now());

        TimetableFieldNumberVersion save = timetableFieldNumberVersionRepository.save(timetableFieldNumberVersion);
        System.out.println(save);

        return "redirect:/";
    }

    @RequestMapping(value="/read", method= RequestMethod.GET)
    public String read() {
        List<TimetableFieldNumberVersion> all = timetableFieldNumberVersionRepository.findAll();
        all.forEach(timetableFieldNumberVersion -> System.out.println(timetableFieldNumberVersion));

        return "redirect:/";
    }

}
