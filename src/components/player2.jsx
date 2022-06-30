import { Replay10 } from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardActions,
  Modal,
  CircularProgress,
  Fab,
  ButtonGroup,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
} from "@mui/material";

import React, { useState, useRef, useEffect } from "react";
import { BigPlayButton, ControlBar, Player } from "video-react";

function PLayertrial() {
  var chapters = [
    { title: "chapter1", time: 10 },
    { title: "chapter2", time: 20 },
    { title: "chapter3", time: 30 },
  ];

  var questions = [
    {
      header: "This is the 1st question",
      option1: "this is the first option",
      option2: "this is the second option",
      option3: "this is the third option",
      option4: "this is the fourth option",
      time: 10,
    },
    {
      header: "This is the 2n question",
      option1: "this is the first option",
      option2: "this is the second option",
      option3: "this is the third option",
      option4: "this is the fourth option",
      time: 20,
    },
    {
      header: "This is the 3rd question",
      option1: "this is the first option",
      option2: "this is the second option",
      option3: "this is the third option",
      option4: "this is the fourth option",
      time: 30,
    },
  ];

  ///Use States -------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------

  const playerRef = useRef(null);
  const [Switch, setSwitch] = useState(true);
  const [Timer, setTimer] = useState(0);
  const [Timer2, setTimer2] = useState(0);
  const [Intervals, setIntervals] = useState(null);
  const [OpenModal, setOpenModal] = useState(false);
  const [HoldDuration, setHoldDuration] = useState();
  const [TaskCompleted, setTaskCompleted] = useState(false);
  const [isSeeked, setisSeeked] = useState(false);
  const [loading, setLoading] = useState();

  ///Use Effects ------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------

  useEffect(() => {
    setTimeout(() => {
      setHoldDuration(parseInt(playerRef.current.getState().player.duration));
    }, 500);
  }, []);

  useEffect(() => {
    const Timekeeper = parseInt(window.localStorage.getItem("time"));
    playerRef.current.seek(Timekeeper);
    setTimer(Timekeeper);
    setTimer2(Timekeeper);
  }, []);

  useEffect(() => {
    handleCompleted();
    // eslint-disable-next-line no-unused-vars
    const id = chapters.map((chapter) => {
      if (chapter.time === Timer) {
        setOpenModal(!OpenModal);
        playPause();
      }
      return chapter;
    });

    if (Timer === HoldDuration) {
      playPause();
      clearInterval(Intervals);
    }
    handleLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Timer]);

  useEffect(() => {
    if (Timer2 === Timer && isSeeked) {
      clearInterval(Intervals);
      setIntervals(
        setInterval(() => {
          setTimer2((old) => old + 1);
          setTimer((old) => old + 1);
        }, 1000)
      );
      setisSeeked(false);
    }

    console.log(Timer, Timer2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Timer2]);

  ///Const-------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  /*const startStopTimers =() =>{
  if(Switch2 === true){
    
  }
}*/
  const handleLoading = () => {
    setLoading(playerRef.current.getState().player.autoPaused);
  };

  const handleCompleted = () => {
    if (Timer >= HoldDuration) {
      setTaskCompleted(true);
      setSwitch(true);
    }
  };

  const result = new Date(Timer2 * 1000).toISOString().slice(11, 19);

  const handleSeek = () => {
    playerRef.current.replay(10);
    clearInterval(Intervals);
    setTimer2((old) => {
      if (old - 10 < 0) {
        return 0;
      } else {
        return old - 10;
      }
    });
    setIntervals(
      setInterval(() => {
        setTimer2((old) => old + 1);
      }, 1000)
    );
    playerRef.current.play();
    setSwitch(false);
    setisSeeked(true);
  };
  // const handleReplay = () => {
  //   clearInterval(Intervals);
  //   setTimer2(0);

  //   setIntervals(
  //     setInterval(() => {
  //       setTimer2((old) => old + 1);
  //     }, 1000)
  //   );
  //   setisSeeked(true);
  //   playerRef.current.seek(0);
  // };
  const handleChapter = (time) => {
    clearInterval(Intervals);
    setTimer2(time);
    setIntervals(
      setInterval(() => {
        setTimer2((old) => old + 1);
      }, 1000)
    );
    setisSeeked(true);
    playerRef.current.play();
    setSwitch(false);
    playerRef.current.seek(time);
  };

  const handleProgressChange = (e, value) => {
    if (value < Timer) {
      setIntervals(
        setInterval(() => {
          setTimer2((old) => old + 1);
        }, 1000)
      );
      setisSeeked(true);
      playerRef.current.play();
      setSwitch(false);
      clearInterval(Intervals);
      setTimer2(value);
      playerRef.current.seek(value);
    }
  };

  const playPause = () => {
    if (loading === false) {
      if (Timer === HoldDuration) {
        playerRef.current.pause();
        setSwitch(true);
      } else {
        if (Switch === true) {
          playerRef.current.play();
          setSwitch(false);
          setIntervals(
            setInterval(() => {
              setTimer((old) => old + 1);
              setTimer2((old) => old + 1);
            }, 1000)
          );
        } else {
          playerRef.current.pause();
          setSwitch(true);
          clearInterval(Intervals);
          window.localStorage.setItem("time", parseInt(Timer));
        }
      }
    }
  };

  //-------------------------------------------------------------------------------
  //----------------------------------------------------- --------------------------
  //-------------------------------------------------------------------------------

  return (
    <Box
      width={"70%"}
      height="100%"
      bgcolor={"aliceblue"}
      justifyContent={"center"}
      padding="10px"
      mx={"15%"}
    >
      <Box sx={{ pointerEvents: "none" }}>
        <Player ref={playerRef}>
          <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
          <BigPlayButton position="center" sx={{ display: "none" }} />
          <ControlBar disableCompletely />
        </Player>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", paddingY: "10px" }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: "20px",
            ml: "95%",
            mt: "-9%",
          }}
        >
          <Fab aria-label="save" color="secondary" size="small">
            {`${parseInt((Timer / HoldDuration) * 100)}%`}
          </Fab>
          <CircularProgress
            variant="determinate"
            value={parseInt((Timer / HoldDuration) * 100)}
            size={46}
            sx={{
              color: "-moz-initial",
              position: "absolute",
              top: -2.4,
              left: -2.9,
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
      <Box alignItems="center">
        <Typography variant="body2" color={"primary"} marginRight="10px">
          {result}
        </Typography>
        <Slider
          min={0}
          size="small"
          max={HoldDuration}
          value={Timer2}
          onChange={handleProgressChange}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box
        justifyContent="space-between"
        alignItems={"center"}
        sx={{
          mb: "10px",
          display: { xs: "inherit", sm: "inherit", md: "flex" },
        }}
      >
        <Button variant="contained" onClick={playPause} sx={{}}>
          {Switch ? "play" : "pause"}
        </Button>
        <Fab
          size="small"
          color="primary"
          onClick={() => {
            handleSeek();
          }}
          variant="contained"
          sx={{ mx: "10px", boxShadow: "none" }}
        >
          <Replay10 sx={{ width: "30px", height: "30px" }} />
        </Fab>

        <ButtonGroup
          marginLeft="10px"
          sx={{ alignContent: "center", my: "10px", mr: "5%" }}
        >
          {chapters.map((e) => {
            return (
              <Button
                variant="contained"
                sx={{ width: "50%" }}
                size="small"
                disabled={e.time >= Timer + 1}
                onClick={() => {
                  handleChapter(e.time);
                  setisSeeked(true);
                }}
              >
                {e.title}
              </Button>
            );
          })}
        </ButtonGroup>
        <Button
          variant="contained"
          sx={{ pointerEvents: "none" }}
          color={TaskCompleted ? "success" : "warning"}
        >
          Completed
        </Button>
      </Box>

      <Modal open={OpenModal}>
        <Box
          width="100%"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "47%",
            height: "30%",
            p: 4,
          }}
        >
          <Card>
            <Box>
              {questions.map((e) => {
                if (e.time === Timer) {
                  return (
                    <Box sx={{ padding: "20px" }}>
                      <Typography variant="h6" fontWeight={500}>
                        {e.header}
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={e.option1}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label={e.option2}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label={e.option3}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label={e.option4}
                        />
                      </FormGroup>
                    </Box>
                  );
                }
              })}
            </Box>

            <CardActions>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(!OpenModal);
                  playPause();
                }}
                sx={{ ml: "88%" }}
              >
                Done
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}

export default PLayertrial;
