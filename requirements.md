# Robot Challenge

## Description

- The application is a simulation of a toy robot moving on a square tabletop, of dimensions 5 units x 5 units.
- There are no other obstructions on the table surface.
- The robot is free to roam around the surface of the table, but must be prevented from falling to destruction. Any movement
  that would result in the robot falling from the table must be prevented, however further valid movement commands must still
  be allowed.

Create an application that can read in commands of the following form:

```plain
PLACE X,Y,F
MOVE
LEFT
RIGHT
REPORT
MOVE
REPORT
```

- PLACE will put the toy robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST.
- The origin (0,0) can be considered to be the SOUTH WEST most corner.
- The first valid command to the robot is a PLACE command, after that, any sequence of commands may be issued, in any order, including another PLACE command. The application should discard all commands in the sequence until a valid PLACE command has been executed.
- MOVE will move the toy robot one unit forward in the direction it is currently facing.
- LEFT and RIGHT will rotate the robot 90 degrees in the specified direction without changing the position of the robot.
- REPORT will announce the X,Y and orientation of the robot.
- A robot that is not on the table can choose to ignore the MOVE, LEFT, RIGHT and REPORT commands.
- The application must not exit after the first REPORT command, i.e. many REPORT commands can be received per session.
- It is up to you how you exit the application (e.g. exit command, Ctrl-C etc.)
- Provide test data to exercise the application.

## Constraints

The toy robot must not fall off the table during movement. This also includes the initial placement of the toy robot.
Any move that would cause the robot to fall must be ignored.

Example Input and Output:

```plain
PLACE 0,0,NORTH
MOVE
REPORT
Output: 0,1,NORTH
```

```plain
PLACE 0,0,NORTH
LEFT
REPORT
Output: 0,0,WEST
```

```plain
PLACE 1,2,EAST
MOVE
MOVE
LEFT
MOVE
REPORT
Output: 3,3,NORTH
```

## Deliverables

The source files, the test data and any test code (as well as explanations of how to run everything).

## Expectations

- There is no time limit for the test, you can take as long as you like, but a reasonable thing that most people do is to take a weekend to do it and send the solution back (i.e. turn it around within a week). If you need more time that's fine, just send us a quick message to let us know.
- You're welcome to use whatever language you like, our tech stack is Ruby and Typescript so either one of those would be well regarded, but if you want to use a different language you're welcome to, just make sure we can easily run it (e.g. docker image). It's also worthwhile to make sure that the language you pick (if something other than Ruby or TS) is the best way to showcase your skills. Remember you will be pairing and extending this solution if you get to that part of the interview process.
- The expectation is that you will create a command line application, please don't build a web ui/api etc.
- You will use this coding test as a showcase of your skills as a developer, we should be able to look at this code and learn something about the way you think and about how you solve problems.

We're not just looking for a minimal solution that would solve the problem. We're looking for:

- production quality code
- good OO and/or functional practices
- a solid testing approach
- well thought out naming
- solid error handling
- extensibility/maintainability/\*ility
- good design from a software engineering perspective
- separation of concerns, i.e. low coupling high cohesion
- sensible breakdown of code into files/modules
- use of best practices/idioms when it comes to language, testing etc.
- appropriate use of tools/frameworks
- performant code, i.e. memory/cpu efficient
- etc

Basically treat the coding test as if it's a larger problem, a little bit of over-engineering is likely a good idea.